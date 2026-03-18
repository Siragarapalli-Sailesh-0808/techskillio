// Form Progress Manager
// Handles progressive disclosure, progress tracking, and draft saving for registration forms

class FormProgressManager {
    constructor(formId, sections) {
        this.formId = formId;
        this.sections = sections || [];
        this.currentSection = 0;
        this.formData = {};
        this.draftKey = `formDraft_${formId}`;
        this.autoSaveInterval = null;
        
        this.init();
    }

    /**
     * Initialize the form progress manager
     */
    init() {
        this.loadDraft();
        this.initializeAccordions();
        this.setupAutoSave();
        this.setupValidation();
        this.updateProgress();
    }

    /**
     * Initialize section accordions
     */
    initializeAccordions() {
        const form = document.getElementById(this.formId);
        if (!form) return;

        // Find all form sections
        const sectionElements = form.querySelectorAll('.form-section');
        
        sectionElements.forEach((section, index) => {
            // Add accordion functionality
            const header = section.querySelector('.form-section-title, h3');
            if (header) {
                // Make header clickable
                header.style.cursor = 'pointer';
                header.onclick = () => this.toggleSection(index);
                
                // Add expand/collapse icon
                if (!header.querySelector('.section-toggle-icon')) {
                    const icon = document.createElement('i');
                    icon.className = 'fas fa-chevron-down section-toggle-icon';
                    icon.style.marginLeft = '10px';
                    icon.style.transition = 'transform 0.3s ease';
                    header.appendChild(icon);
                }
            }

            // Collapse all sections except first
            if (index > 0) {
                this.collapseSection(section);
            }
        });
    }

    /**
     * Toggle section visibility
     */
    toggleSection(index) {
        const form = document.getElementById(this.formId);
        const sections = form.querySelectorAll('.form-section');
        const section = sections[index];
        
        if (section.classList.contains('collapsed')) {
            this.expandSection(section);
        } else {
            this.collapseSection(section);
        }
    }

    /**
     * Collapse a section
     */
    collapseSection(section) {
        section.classList.add('collapsed');
        const content = section.querySelectorAll('.form-row, .form-group');
        content.forEach(el => {
            el.style.display = 'none';
        });
        
        const icon = section.querySelector('.section-toggle-icon');
        if (icon) {
            icon.style.transform = 'rotate(-90deg)';
        }
    }

    /**
     * Expand a section
     */
    expandSection(section) {
        section.classList.remove('collapsed');
        const content = section.querySelectorAll('.form-row, .form-group');
        content.forEach(el => {
            el.style.display = '';
        });
        
        const icon = section.querySelector('.section-toggle-icon');
        if (icon) {
            icon.style.transform = 'rotate(0deg)';
        }
    }

    /**
     * Update progress indicator
     */
    updateProgress() {
        const form = document.getElementById(this.formId);
        if (!form) return;

        // Calculate progress
        const allFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        const filledFields = Array.from(allFields).filter(field => {
            if (field.type === 'checkbox' || field.type === 'radio') {
                return field.checked;
            }
            return field.value.trim() !== '';
        });

        const progress = Math.round((filledFields.length / allFields.length) * 100);

        // Update or create progress bar
        let progressContainer = document.getElementById('formProgressContainer');
        if (!progressContainer) {
            progressContainer = this.createProgressBar();
            form.insertBefore(progressContainer, form.firstChild);
        }

        const progressBar = progressContainer.querySelector('.progress-bar-fill');
        const progressText = progressContainer.querySelector('.progress-text');
        
        if (progressBar) progressBar.style.width = progress + '%';
        if (progressText) progressText.textContent = progress + '% Complete';

        // Update section completion indicators
        this.updateSectionIndicators();
    }

    /**
     * Create progress bar HTML
     */
    createProgressBar() {
        const container = document.createElement('div');
        container.id = 'formProgressContainer';
        container.innerHTML = `
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: 0%"></div>
                </div>
                <span class="progress-text">0% Complete</span>
            </div>
            <style>
                .progress-container {
                    background: white;
                    padding: 1rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }
                .progress-bar {
                    height: 8px;
                    background: #e2e8f0;
                    border-radius: 10px;
                    overflow: hidden;
                    margin-bottom: 0.5rem;
                }
                .progress-bar-fill {
                    height: 100%;
                    background: linear-gradient(135deg, #86c540, #6e9443);
                    transition: width 0.3s ease;
                }
                .progress-text {
                    color: #64748b;
                    font-size: 0.9rem;
                    font-weight: 600;
                }
            </style>
        `;
        return container;
    }

    /**
     * Update section completion indicators
     */
    updateSectionIndicators() {
        const form = document.getElementById(this.formId);
        const sections = form.querySelectorAll('.form-section');

        sections.forEach((section, index) => {
            const requiredFields = section.querySelectorAll('input[required], select[required], textarea[required]');
            const filledFields = Array.from(requiredFields).filter(field => {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    return field.checked;
                }
                return field.value.trim() !== '';
            });

            const isComplete = requiredFields.length > 0 && filledFields.length === requiredFields.length;
            
            const header = section.querySelector('.form-section-title, h3');
            if (header) {
                // Remove existing indicator
                const existingIndicator = header.querySelector('.section-indicator');
                if (existingIndicator) {
                    existingIndicator.remove();
                }

                // Add completion indicator
                if (isComplete) {
                    const indicator = document.createElement('i');
                    indicator.className = 'fas fa-check-circle section-indicator';
                    indicator.style.color = '#86c540';
                    indicator.style.marginLeft = '10px';
                    header.insertBefore(indicator, header.firstChild);
                }
            }
        });
    }

    /**
     * Setup auto-save functionality
     */
    setupAutoSave() {
        const form = document.getElementById(this.formId);
        if (!form) return;

        // Save on input change
        form.addEventListener('input', () => {
            this.updateProgress();
        });

        // Auto-save every 30 seconds
        this.autoSaveInterval = setInterval(() => {
            this.saveDraft();
        }, 30000);

        // Add manual save button
        this.addSaveButton();
    }

    /**
     * Add save draft button
     */
    addSaveButton() {
        const form = document.getElementById(this.formId);
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (submitButton && !document.getElementById('saveDraftButton')) {
            const saveButton = document.createElement('button');
            saveButton.id = 'saveDraftButton';
            saveButton.type = 'button';
            saveButton.className = 'btn btn-secondary';
            saveButton.innerHTML = '<i class="fas fa-save"></i> Save Draft';
            saveButton.style.marginRight = '1rem';
            saveButton.onclick = () => {
                this.saveDraft();
                this.showNotification('Draft saved successfully!');
            };
            
            submitButton.parentNode.insertBefore(saveButton, submitButton);
        }
    }

    /**
     * Save form draft to localStorage
     */
    saveDraft() {
        const form = document.getElementById(this.formId);
        if (!form) return;

        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        const draft = {
            data: data,
            timestamp: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        };

        try {
            localStorage.setItem(this.draftKey, JSON.stringify(draft));
            console.log('Draft saved:', draft);
        } catch (error) {
            console.error('Failed to save draft:', error);
        }
    }

    /**
     * Load draft from localStorage
     */
    loadDraft() {
        try {
            const saved = localStorage.getItem(this.draftKey);
            if (!saved) return;

            const draft = JSON.parse(saved);
            
            // Check if draft has expired
            if (new Date(draft.expiresAt) < new Date()) {
                localStorage.removeItem(this.draftKey);
                return;
            }

            // Ask user if they want to restore
            if (confirm('We found a saved draft. Would you like to restore it?')) {
                this.restoreDraft(draft.data);
            }
        } catch (error) {
            console.error('Failed to load draft:', error);
        }
    }

    /**
     * Restore draft data to form
     */
    restoreDraft(data) {
        const form = document.getElementById(this.formId);
        if (!form) return;

        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = data[key] === 'on' || data[key] === field.value;
                } else {
                    field.value = data[key];
                }
            }
        });

        this.updateProgress();
        this.showNotification('Draft restored successfully!');
    }

    /**
     * Setup enhanced validation
     */
    setupValidation() {
        const form = document.getElementById(this.formId);
        if (!form) return;

        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                // Clear error on input
                this.clearFieldError(input);
            });
        });

        // Form submission validation
        form.addEventListener('submit', (e) => {
            if (!this.validateForm()) {
                e.preventDefault();
                this.scrollToFirstError();
            }
        });
    }

    /**
     * Validate individual field
     */
    validateField(field) {
        const isValid = field.checkValidity();
        
        if (!isValid) {
            this.showFieldError(field, field.validationMessage);
        } else {
            this.clearFieldError(field);
            this.showFieldSuccess(field);
        }
        
        return isValid;
    }

    /**
     * Validate entire form
     */
    validateForm() {
        const form = document.getElementById(this.formId);
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        const errors = [];

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
                errors.push({
                    field: input.name,
                    message: input.validationMessage
                });
            }
        });

        if (!isValid) {
            this.showErrorSummary(errors);
        }

        return isValid;
    }

    /**
     * Show field error
     */
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '0.25rem';
        field.parentNode.appendChild(errorDiv);
    }

    /**
     * Clear field error
     */
    clearFieldError(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    /**
     * Show field success
     */
    showFieldSuccess(field) {
        if (field.value.trim() !== '') {
            field.classList.add('success');
        }
    }

    /**
     * Show error summary
     */
    showErrorSummary(errors) {
        const form = document.getElementById(this.formId);
        
        // Remove existing summary
        const existingSummary = document.getElementById('errorSummary');
        if (existingSummary) {
            existingSummary.remove();
        }

        // Create error summary
        const summary = document.createElement('div');
        summary.id = 'errorSummary';
        summary.className = 'error-summary';
        summary.innerHTML = `
            <h4><i class="fas fa-exclamation-triangle"></i> Please fix the following errors:</h4>
            <ul>
                ${errors.map(error => `<li>${error.message}</li>`).join('')}
            </ul>
            <style>
                .error-summary {
                    background: #fee2e2;
                    border-left: 4px solid #ef4444;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 2rem;
                }
                .error-summary h4 {
                    color: #991b1b;
                    margin: 0 0 0.5rem 0;
                }
                .error-summary ul {
                    margin: 0;
                    padding-left: 1.5rem;
                    color: #991b1b;
                }
            </style>
        `;
        
        form.insertBefore(summary, form.firstChild);
    }

    /**
     * Scroll to first error
     */
    scrollToFirstError() {
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }

    /**
     * Show notification
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #86c540;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormProgressManager;
}
