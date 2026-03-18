/**
 * Dashboard User Profile Loader
 * Fetches and displays user profile data in dashboards
 */

class DashboardProfileLoader {
    constructor() {
        this.userData = null;
        this.userProfile = null;
        this.userType = null;
    }

    /**
     * Load user profile from API
     */
    async loadUserProfile() {
        try {
            // Check if authManager is available
            if (typeof authManager === 'undefined') {
                console.error('AuthManager not loaded');
                return false;
            }

            // Fetch user profile from API
            const result = await authManager.getUserProfile();

            if (result.success && result.data) {
                this.userData = result.data.user;
                this.userProfile = result.data.profile;
                this.userType = result.data.user_type;

                // Update UI with profile data
                this.updateDashboardUI();
                return true;
            } else {
                console.error('Failed to load profile:', result.error);
                // Try to load from localStorage as fallback
                this.loadFromLocalStorage();
                return false;
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            // Try to load from localStorage as fallback
            this.loadFromLocalStorage();
            return false;
        }
    }

    /**
     * Load profile from localStorage (fallback)
     */
    loadFromLocalStorage() {
        try {
            const storedProfile = localStorage.getItem('userProfile');
            const storedUserType = localStorage.getItem('userType');

            if (storedProfile) {
                this.userProfile = JSON.parse(storedProfile);
            }

            if (storedUserType) {
                this.userType = storedUserType;
            }

            this.updateDashboardUI();
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }

    /**
     * Update dashboard UI with user data
     */
    updateDashboardUI() {
        // Update user name display
        this.updateUserName();

        // Update user type badge
        this.updateUserTypeBadge();

        // Update profile-specific data
        this.updateProfileData();
    }

    /**
     * Update user name in dashboard
     */
    updateUserName() {
        const nameElement = document.getElementById('userNameDisplay');
        if (nameElement && this.userProfile) {
            // Try different name fields based on user type
            let displayName = 'User';

            if (this.userType && this.userType.includes('employer')) {
                // For employers, prefer institution_name
                displayName = this.userProfile.institution_name ||
                    this.userProfile.full_name ||
                    this.userProfile.name ||
                    'Employer';
            } else {
                // For candidates, prefer full_name
                displayName = this.userProfile.full_name ||
                    this.userProfile.name ||
                    this.userProfile.institution_name ||
                    'User';
            }

            // Extract first name or use full name if it's short
            const firstName = displayName.split(' ')[0];
            nameElement.textContent = firstName;
        }
    }

    /**
     * Update user type badge
     */
    updateUserTypeBadge() {
        const badgeElement = document.getElementById('userTypeBadge');
        if (badgeElement && this.userType) {
            const userTypeLabels = {
                'it_candidate': 'IT Candidate',
                'it_vendor': 'IT Vendor',
                'teacher_candidate': 'Teacher Candidate',
                'teacher_employer': 'Teacher Employer',
                'admin': 'Administrator'
            };

            badgeElement.textContent = userTypeLabels[this.userType] || this.userType;
        }
    }

    /**
     * Update profile-specific data based on user type
     */
    updateProfileData() {
        if (!this.userProfile) return;

        // Update based on user type
        if (this.userType && this.userType.includes('teacher')) {
            this.updateTeacherProfile();
        } else if (this.userType && this.userType.includes('it')) {
            this.updateITProfile();
        }
    }

    /**
     * Update teacher-specific profile data
     */
    updateTeacherProfile() {
        // Update current profile
        const currentProfileEl = document.getElementById('currentProfile');
        if (currentProfileEl && this.userProfile.current_profile) {
            currentProfileEl.textContent = this.userProfile.current_profile;
        }

        // Update experience
        const experienceEl = document.getElementById('totalExperience');
        if (experienceEl && this.userProfile.total_experience_years !== undefined) {
            experienceEl.textContent = `${this.userProfile.total_experience_years} years`;
        }

        // Update qualification
        const qualificationEl = document.getElementById('qualification');
        if (qualificationEl && this.userProfile.qualification) {
            qualificationEl.textContent = this.userProfile.qualification;
        }

        // Update location
        const locationEl = document.getElementById('currentLocation');
        if (locationEl && this.userProfile.current_city) {
            locationEl.textContent = this.userProfile.current_city;
        }

        // Update status
        const statusEl = document.getElementById('profileStatus');
        if (statusEl && this.userProfile.status) {
            const statusLabels = {
                'pending': 'Pending Review',
                'approved': 'Approved',
                'rejected': 'Rejected',
                'active': 'Active'
            };
            statusEl.textContent = statusLabels[this.userProfile.status] || this.userProfile.status;

            // Add status-specific styling
            statusEl.className = `status-badge status-${this.userProfile.status}`;
        }
    }

    /**
     * Update IT-specific profile data
     */
    updateITProfile() {
        // Update role
        const roleEl = document.getElementById('currentRole');
        if (roleEl && this.userProfile.current_role) {
            roleEl.textContent = this.userProfile.current_role;
        }

        // Update experience
        const experienceEl = document.getElementById('totalExperience');
        if (experienceEl && this.userProfile.years_of_experience !== undefined) {
            experienceEl.textContent = `${this.userProfile.years_of_experience} years`;
        }

        // Update skills
        const skillsEl = document.getElementById('keySkills');
        if (skillsEl && this.userProfile.key_skills) {
            const skills = Array.isArray(this.userProfile.key_skills)
                ? this.userProfile.key_skills
                : this.userProfile.key_skills.split(',');
            skillsEl.innerHTML = skills.slice(0, 5).map(skill =>
                `<span class="skill-tag">${skill.trim()}</span>`
            ).join('');
        }
    }

    /**
     * Get user profile data
     */
    getProfile() {
        return this.userProfile;
    }

    /**
     * Get user type
     */
    getUserType() {
        return this.userType;
    }

    /**
     * Get user data
     */
    getUserData() {
        return this.userData;
    }
}

// Create global instance
const dashboardProfileLoader = new DashboardProfileLoader();

// Auto-load profile when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        dashboardProfileLoader.loadUserProfile();
    });
} else {
    // DOM already loaded
    dashboardProfileLoader.loadUserProfile();
}
