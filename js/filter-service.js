// Filter Service
// Provides comprehensive filtering capabilities for candidate search and job listings

class FilterService {
    constructor() {
        this.filters = {};
        this.activeFilters = [];
        this.loadSavedFilters();
    }

    /**
     * Apply filters to a dataset
     * @param {Array} data - Array of items to filter
     * @param {Object} filters - Filter criteria
     * @returns {Array} Filtered data
     */
    applyFilters(data, filters) {
        if (!filters || Object.keys(filters).length === 0) {
            return data;
        }

        return data.filter(item => {
            // Subject filter (multi-select)
            if (filters.subjects && filters.subjects.length > 0) {
                const itemSubjects = Array.isArray(item.subjects) ? item.subjects : [item.subject];
                const hasMatchingSubject = filters.subjects.some(subject => 
                    itemSubjects.some(itemSubject => 
                        itemSubject.toLowerCase().includes(subject.toLowerCase())
                    )
                );
                if (!hasMatchingSubject) return false;
            }

            // Experience range filter
            if (filters.experienceMin !== undefined || filters.experienceMax !== undefined) {
                const experience = parseInt(item.experience) || 0;
                if (filters.experienceMin !== undefined && experience < filters.experienceMin) return false;
                if (filters.experienceMax !== undefined && experience > filters.experienceMax) return false;
            }

            // Location filter (partial match)
            if (filters.location && filters.location.trim() !== '') {
                const itemLocation = item.location || '';
                if (!itemLocation.toLowerCase().includes(filters.location.toLowerCase())) {
                    return false;
                }
            }

            // Qualification filter
            if (filters.qualification && filters.qualification !== '') {
                const itemQualification = item.qualification || '';
                if (!itemQualification.toLowerCase().includes(filters.qualification.toLowerCase())) {
                    return false;
                }
            }

            // Board filter (multi-select)
            if (filters.boards && filters.boards.length > 0) {
                const itemBoards = Array.isArray(item.boards) ? item.boards : [item.board];
                const hasMatchingBoard = filters.boards.some(board => 
                    itemBoards.some(itemBoard => 
                        itemBoard.toLowerCase().includes(board.toLowerCase())
                    )
                );
                if (!hasMatchingBoard) return false;
            }

            // Salary range filter
            if (filters.salaryMin !== undefined || filters.salaryMax !== undefined) {
                const salary = this.extractSalary(item.salary || item.expectedSalary);
                if (filters.salaryMin !== undefined && salary < filters.salaryMin) return false;
                if (filters.salaryMax !== undefined && salary > filters.salaryMax) return false;
            }

            // Institution type filter
            if (filters.institutionType && filters.institutionType !== '') {
                const itemType = item.institutionType || item.type || '';
                if (!itemType.toLowerCase().includes(filters.institutionType.toLowerCase())) {
                    return false;
                }
            }

            // Job type filter (Full-time/Part-time/Contract)
            if (filters.jobType && filters.jobType !== '') {
                const itemJobType = item.type || item.jobType || '';
                if (!itemJobType.toLowerCase().includes(filters.jobType.toLowerCase())) {
                    return false;
                }
            }

            // Teaching level filter
            if (filters.teachingLevel && filters.teachingLevel !== '') {
                const itemLevel = item.teachingLevel || item.level || '';
                if (!itemLevel.toLowerCase().includes(filters.teachingLevel.toLowerCase())) {
                    return false;
                }
            }

            // Availability filter
            if (filters.availability && filters.availability !== '') {
                const itemAvailability = item.availability || '';
                if (!itemAvailability.toLowerCase().includes(filters.availability.toLowerCase())) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Extract numeric salary from string (e.g., "₹5-7 LPA" -> 6)
     */
    extractSalary(salaryString) {
        if (typeof salaryString === 'number') return salaryString;
        if (!salaryString) return 0;
        
        const matches = salaryString.match(/(\d+)/g);
        if (matches && matches.length > 0) {
            // If range, take average
            if (matches.length > 1) {
                return (parseInt(matches[0]) + parseInt(matches[1])) / 2;
            }
            return parseInt(matches[0]);
        }
        return 0;
    }

    /**
     * Save current filters to localStorage
     */
    saveFilters(filters) {
        try {
            localStorage.setItem('savedFilters', JSON.stringify(filters));
            this.filters = filters;
        } catch (error) {
            console.error('Failed to save filters:', error);
        }
    }

    /**
     * Load saved filters from localStorage
     */
    loadSavedFilters() {
        try {
            const saved = localStorage.getItem('savedFilters');
            if (saved) {
                this.filters = JSON.parse(saved);
                return this.filters;
            }
        } catch (error) {
            console.error('Failed to load filters:', error);
        }
        return {};
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.filters = {};
        this.activeFilters = [];
        localStorage.removeItem('savedFilters');
    }

    /**
     * Get count of filtered results
     */
    getResultCount(data, filters) {
        return this.applyFilters(data, filters).length;
    }

    /**
     * Create filter chips HTML for active filters
     */
    createFilterChips(filters) {
        const chips = [];

        if (filters.subjects && filters.subjects.length > 0) {
            filters.subjects.forEach(subject => {
                chips.push(this.createChip('Subject', subject, 'subjects', subject));
            });
        }

        if (filters.experienceMin !== undefined || filters.experienceMax !== undefined) {
            const min = filters.experienceMin || 0;
            const max = filters.experienceMax || '20+';
            chips.push(this.createChip('Experience', `${min}-${max} years`, 'experience'));
        }

        if (filters.location) {
            chips.push(this.createChip('Location', filters.location, 'location'));
        }

        if (filters.qualification) {
            chips.push(this.createChip('Qualification', filters.qualification, 'qualification'));
        }

        if (filters.boards && filters.boards.length > 0) {
            filters.boards.forEach(board => {
                chips.push(this.createChip('Board', board, 'boards', board));
            });
        }

        if (filters.salaryMin !== undefined || filters.salaryMax !== undefined) {
            const min = filters.salaryMin || 0;
            const max = filters.salaryMax || '50+';
            chips.push(this.createChip('Salary', `₹${min}-${max} LPA`, 'salary'));
        }

        if (filters.institutionType) {
            chips.push(this.createChip('Institution', filters.institutionType, 'institutionType'));
        }

        if (filters.jobType) {
            chips.push(this.createChip('Job Type', filters.jobType, 'jobType'));
        }

        if (filters.teachingLevel) {
            chips.push(this.createChip('Level', filters.teachingLevel, 'teachingLevel'));
        }

        if (filters.availability) {
            chips.push(this.createChip('Availability', filters.availability, 'availability'));
        }

        return chips.join('');
    }

    /**
     * Create individual filter chip HTML
     */
    createChip(label, value, filterKey, arrayValue = null) {
        const removeAction = arrayValue 
            ? `removeArrayFilter('${filterKey}', '${arrayValue}')`
            : `removeFilter('${filterKey}')`;
        
        return `
            <div class="filter-chip">
                <span class="chip-label">${label}:</span>
                <span class="chip-value">${value}</span>
                <button class="chip-remove" onclick="${removeAction}">×</button>
            </div>
        `;
    }

    /**
     * Get filter presets for quick filtering
     */
    getPresets(type = 'candidate') {
        if (type === 'candidate') {
            return {
                'Fresh Graduates': {
                    experienceMin: 0,
                    experienceMax: 2
                },
                'Experienced Teachers': {
                    experienceMin: 5,
                    experienceMax: 20
                },
                'CBSE Specialists': {
                    boards: ['CBSE']
                },
                'Mathematics Teachers': {
                    subjects: ['Mathematics']
                }
            };
        } else if (type === 'job') {
            return {
                'High Salary': {
                    salaryMin: 7,
                    salaryMax: 50
                },
                'Entry Level': {
                    experienceMin: 0,
                    experienceMax: 3
                },
                'Full Time': {
                    jobType: 'Full-time'
                },
                'CBSE Schools': {
                    boards: ['CBSE']
                }
            };
        }
        return {};
    }

    /**
     * Apply a preset filter
     */
    applyPreset(presetName, type = 'candidate') {
        const presets = this.getPresets(type);
        if (presets[presetName]) {
            return presets[presetName];
        }
        return {};
    }
}

// Create global instance
const filterService = new FilterService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FilterService;
}
