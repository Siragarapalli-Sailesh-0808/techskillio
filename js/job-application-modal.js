// Job Application Modal Component
// Handles job application submissions with user session management

class JobApplicationModal {
    constructor() {
        this.currentJob = null;
        this.userSession = null;
        this.initModal();
    }

    /**
     * Initialize the modal HTML structure
     */
    initModal() {
        const modalHTML = `
            <div id="jobApplicationModal" class="job-modal-overlay" style="display: none;">
                <div class="job-modal">
                    <div class="job-modal-header">
                        <h2 id="modalTitle">Job Details</h2>
                        <button class="close-modal" onclick="jobApplicationModal.closeModal()">&times;</button>
                    </div>
                    
                    <div class="job-modal-body">
                        <!-- Job Details Summary -->
                        <div class="job-summary">
                            <h3 id="modalJobTitle"></h3>
                            <p id="modalInstitution"></p>
                            <div id="modalPostedByRow" class="job-posted-by" style="margin: 0.75rem 0; padding: 0.75rem 1rem; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                                <span id="modalPostedByLabel" class="detail-label" style="display: block; font-size: 0.75rem; color: #1e40af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem;">Company Name</span>
                                <span id="modalPostedBy" style="font-weight: 600; color: #1e293b;"></span>
                            </div>
                            <div class="job-meta">
                                <span id="modalLocation"></span>
                                <span id="modalSalary"></span>
                            </div>
                            <!-- Extended Details -->
                            <div class="job-extended-details" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed #e2e8f0;">
                                <div class="detail-item">
                                    <span class="detail-label" style="display: block; font-size: 0.8rem; color: #64748b;">Experience</span>
                                    <span id="modalExperience" style="font-weight: 600; color: #2c3e50;"></span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label" style="display: block; font-size: 0.8rem; color: #64748b;">Employment Type</span>
                                    <span id="modalEmploymentType" style="font-weight: 600; color: #2c3e50;"></span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label" style="display: block; font-size: 0.8rem; color: #64748b;">Work Mode</span>
                                    <span id="modalWorkMode" style="font-weight: 600; color: #2c3e50;"></span>
                                </div>
                            </div>
                            
                            <!-- Skills & Subjects -->
                            <div id="modalSkillsSection" style="margin-top: 1rem; display: none;">
                                <span class="detail-label" style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.5rem;">Skills Required</span>
                                <div id="modalSkills" style="display: flex; flex-wrap: wrap; gap: 0.5rem;"></div>
                            </div>
                            <div id="modalSubjectsSection" style="margin-top: 1rem; display: none;">
                                <span class="detail-label" style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.5rem;">Subjects</span>
                                <div id="modalSubjects" style="display: flex; flex-wrap: wrap; gap: 0.5rem;"></div>
                            </div>

                            <!-- Detailed Description Area -->
                            <div id="modalJobDescription" class="job-description-content" style="margin-top: 15px; border-top: 1px solid #e2e8f0; padding-top: 15px; display: none;">
                                <h4>Description</h4>
                                <p id="modalDescText"></p>
                            </div>
                        </div>

                        <!-- View Mode Actions -->
                        <div id="viewModeActions" class="form-actions" style="margin-top: 0; margin-bottom: 2rem; display: none;">
                            <button type="button" class="btn-secondary" onclick="jobApplicationModal.closeModal()">Close</button>
                            <button class="btn-primary" onclick="jobApplicationModal.switchToApplyMode()">
                                <i class="fas fa-paper-plane"></i> Apply Now
                            </button>
                        </div>

                        <!-- Application Form -->
                        <form id="jobApplicationForm" style="display: none;">
                            <div class="form-section">
                                <h4 style="margin-top: 0;">Personal Information</h4>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Full Name <span class="required">*</span></label>
                                        <input type="text" name="fullName" id="appFullName" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Email <span class="required">*</span></label>
                                        <input type="email" name="email" id="appEmail" required>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Phone <span class="required">*</span></label>
                                        <input type="tel" name="phone" id="appPhone" required pattern="[0-9]{10}">
                                    </div>
                                    <div class="form-group">
                                        <label>Experience (Years) <span class="required">*</span></label>
                                        <input type="number" name="experience" id="appExperience" required min="0">
                                    </div>
                                </div>
                            </div>

                            <div class="form-section">
                                <h4>Application Details</h4>
                                <div class="form-group">
                                    <label>Cover Letter</label>
                                    <textarea name="coverLetter" id="appCoverLetter" rows="4" 
                                        placeholder="Tell us why you're a great fit for this position..."></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Resume <span class="required">*</span></label>
                                    <input type="file" name="resume" id="appResume" accept=".pdf,.doc,.docx" required>
                                    <small style="color: #64748b;">PDF or Word document, max 2MB</small>
                                </div>
                            </div>

                            <div class="form-actions">
                                <button type="button" class="btn-secondary" onclick="jobApplicationModal.closeModal()">
                                    Cancel
                                </button>
                                <button type="submit" class="btn-primary">
                                    <i class="fas fa-paper-plane"></i> Submit Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>
                .job-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                }

                .job-modal {
                    background: white;
                    border-radius: 20px;
                    max-width: 700px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.3s ease;
                }

                .job-modal-header {
                    background: linear-gradient(135deg, #86c540, #6e9443);
                    color: white;
                    padding: 1.5rem 2rem;
                    border-radius: 20px 20px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .job-modal-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                }

                .close-modal {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                    line-height: 1;
                }

                .job-modal-body {
                    padding: 2rem;
                }

                .job-summary {
                    background: #f8fafc;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                }

                .job-summary h3 {
                    margin: 0 0 0.5rem 0;
                    color: #2c3e50;
                }

                .job-summary p {
                    margin: 0;
                    color: #64748b;
                }

                .job-meta {
                    display: flex;
                    gap: 1rem;
                    margin-top: 0.5rem;
                    color: #64748b;
                    font-size: 0.9rem;
                }

                .job-meta span {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }

                .form-section {
                    margin-bottom: 2rem;
                }

                .form-section h4 {
                    color: #2c3e50;
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid #86c540;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .form-group {
                    margin-bottom: 1rem;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: #2c3e50;
                }

                .form-group .required {
                    color: #ef4444;
                }

                .form-group input,
                .form-group textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-family: 'Poppins', sans-serif;
                }

                .form-group input:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #86c540;
                    box-shadow: 0 0 0 3px rgba(134, 197, 64, 0.1);
                }

                .form-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                    margin-top: 2rem;
                }

                .btn-primary, .btn-secondary {
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #86c540, #6e9443);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(134, 197, 64, 0.3);
                }

                .btn-secondary {
                    background: white;
                    color: #64748b;
                    border: 2px solid #cbd5e1;
                }

                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;

        // Inject modal into page
        if (!document.getElementById('jobApplicationModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.setupFormHandler();
        }
    }

    /**
     * Show job details (View Mode)
     */
    showJobDetails(jobData) {
        this.currentJob = jobData;

        // Reset UI state
        document.getElementById('modalTitle').textContent = 'Job Details';
        document.getElementById('jobApplicationForm').style.display = 'none';
        
        // Populate job details
        this.populateJobInfo(jobData);
        
        // Show description
        const descArea = document.getElementById('modalJobDescription');
        descArea.style.display = 'block';
        document.getElementById('modalDescText').innerHTML = (jobData.description || 'No description available.').replace(/\n/g, '<br>');

        // Check if already applied (visual cue only, logic handled in dashboard usually)
        // But here we want to show "Apply" button or "Applied" button
        const viewActions = document.getElementById('viewModeActions');
        viewActions.style.display = 'flex';
        
        // Disable apply button if already applied? 
        // Ideally the caller should pass this info or we check here.
        // For now, we assume standard Apply button.
        
        document.getElementById('jobApplicationModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    /**
     * Switch to Apply Mode
     */
    switchToApplyMode() {
        // Check Auth first
        if (!authManager.isAuthenticated()) {
            if (confirm('You need to be logged in to apply. Would you like to sign in now?')) {
                localStorage.setItem('returnToJob', JSON.stringify(this.currentJob));
                window.location.href = 'login.html';
            }
            return;
        }

        // Update UI
        document.getElementById('modalTitle').textContent = 'Apply for Position';
        document.getElementById('modalJobDescription').style.display = 'none'; // Optional: hide description to save space
        document.getElementById('viewModeActions').style.display = 'none';
        document.getElementById('jobApplicationForm').style.display = 'block';

        // Pre-fill data
        this.userSession = authManager.getUserProfile ? { email: localStorage.getItem('userEmail') } : this.getUserSession();
        this.prefillUserData();
    }

    /**
     * Helper to populate common info
     */
    populateJobInfo(jobData) {
        document.getElementById('modalJobTitle').textContent = jobData.title;
        document.getElementById('modalInstitution').textContent = jobData.institution || jobData.company;

        // Label: Institution Name for teacher recruiter, Company Name for IT recruiter (by job_category only)
        const isTeacherRecruiter = (jobData.job_category || '').toLowerCase() === 'teacher';
        const postedByLabelEl = document.getElementById('modalPostedByLabel');
        if (postedByLabelEl) postedByLabelEl.textContent = isTeacherRecruiter ? 'Institution Name' : 'Company Name';

        // Value: use shared helper when available (prioritizes company_name / institution_name from jobs API)
        let postedBy = (typeof window.getCompanyOrInstitutionName === 'function')
            ? window.getCompanyOrInstitutionName(jobData)
            : (jobData.institution || jobData.company || jobData.institution_name || jobData.company_name || jobData.school_name || jobData.posted_by_name || jobData.recruiter_name || '');
        if (!postedBy || postedBy === '—') postedBy = 'Not specified';
        const postedByEl = document.getElementById('modalPostedBy');
        const postedByRow = document.getElementById('modalPostedByRow');
        if (postedByEl) postedByEl.textContent = postedBy;
        if (postedByRow) postedByRow.style.display = 'block';
        document.getElementById('modalInstitution').textContent = postedBy;

        document.getElementById('modalLocation').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${jobData.location}`;
        
        // Handle Salary
        let salaryText = jobData.salary || jobData.ctc;
        if (!salaryText && (jobData.salary_min || jobData.salary_max)) {
             salaryText = this.formatSalary(jobData.salary_min, jobData.salary_max);
        }
        document.getElementById('modalSalary').innerHTML = `<i class="fas fa-rupee-sign"></i> ${salaryText || 'Not disclosed'}`;

        // Handle Experience
        const expMin = jobData.experience_min_years;
        const expMax = jobData.experience_max_years;
        let expText = 'Not specified';
        if (expMin !== undefined || expMax !== undefined) {
            if (expMin && expMax) expText = `${expMin} - ${expMax} Years`;
            else if (expMin) expText = `${expMin}+ Years`;
            else if (expMax) expText = `Up to ${expMax} Years`;
        }
        document.getElementById('modalExperience').textContent = expText;

        // Handle Employment Type & Work Mode
        document.getElementById('modalEmploymentType').textContent = jobData.employment_type ? jobData.employment_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Full Time';
        document.getElementById('modalWorkMode').textContent = jobData.work_mode ? jobData.work_mode.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Onsite';

        // Handle Skills
        const skillsContainer = document.getElementById('modalSkills');
        const skillsSection = document.getElementById('modalSkillsSection');
        if (jobData.skills_required && jobData.skills_required.length > 0) {
            skillsSection.style.display = 'block';
            skillsContainer.innerHTML = jobData.skills_required.map(skill => 
                `<span style="background: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${skill}</span>`
            ).join('');
        } else {
            skillsSection.style.display = 'none';
        }

        // Handle Subjects
        const subjectsContainer = document.getElementById('modalSubjects');
        const subjectsSection = document.getElementById('modalSubjectsSection');
        if (jobData.subjects_required && jobData.subjects_required.length > 0) {
            subjectsSection.style.display = 'block';
            subjectsContainer.innerHTML = jobData.subjects_required.map(sub => 
                `<span style="background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${sub}</span>`
            ).join('');
        } else {
            subjectsSection.style.display = 'none';
        }
    }

    formatSalary(min, max) {
        if (!min && !max) return 'Not disclosed';
        if (min > 1000) return `${(min / 100000).toFixed(1)}L - ${(max / 100000).toFixed(1)}L PA`; 
        return `${min} - ${max}`;
    }

    /**
     * Show the application modal directly (Apply Mode)
     * Keeps backward compatibility
     */
    showModal(jobData) {
        this.currentJob = jobData;
        this.populateJobInfo(jobData);
        // Skip view mode, go straight to apply
        this.switchToApplyMode();
        
        // Ensure modal is visible (switchToApplyMode might return early if auth fails, but that's fine)
        if (authManager.isAuthenticated()) {
            document.getElementById('jobApplicationModal').style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close the modal
     */
    closeModal() {
        document.getElementById('jobApplicationModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        document.getElementById('jobApplicationForm').reset();
    }

    /**
     * Get user session from localStorage
     */
    getUserSession() {
        try {
            const session = localStorage.getItem('userSession');
            return session ? JSON.parse(session) : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Pre-fill form with user data
     */
    prefillUserData() {
        if (this.userSession && this.userSession.email) {
            document.getElementById('appEmail').value = this.userSession.email;
        }

        // Try to get saved candidate data
        try {
            const candidateData = localStorage.getItem('candidateProfile');
            if (candidateData) {
                const data = JSON.parse(candidateData);
                if (data.fullName) document.getElementById('appFullName').value = data.fullName;
                if (data.phone) document.getElementById('appPhone').value = data.phone;
                if (data.experience) document.getElementById('appExperience').value = data.experience;
            }
        } catch (error) {
            console.log('No saved profile data');
        }
    }

    /**
     * Setup form submission handler
     */
    setupFormHandler() {
        document.getElementById('jobApplicationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitApplication(e.target);
        });
    }

    /**
     * Submit the application
     */
    /**
     * Submit the application
     */
    async submitApplication(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Validate file size
        const resume = formData.get('resume');
        if (resume && resume.size > 2 * 1024 * 1024) {
            alert('Resume file size must be less than 2MB');
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

            if (typeof authManager === 'undefined') {
                throw new Error('AuthManager not initialized');
            }

            // Append job ID
            formData.append('job', this.currentJob.id);
            
            // Map form fields to API expected keys (snake_case)
            // formData already has: fullName, email, phone, experience, coverLetter, resume
            // We need to match backend expectations. Common Django patterns:
            if (formData.get('fullName')) formData.append('full_name', formData.get('fullName'));
            if (formData.get('coverLetter')) formData.append('cover_letter', formData.get('coverLetter'));
            if (formData.get('experience')) formData.append('experience_years', formData.get('experience'));

            // Send as FormData (authManager handles Content-Type automatically for FormData)
            const response = await authManager.apiRequest('/api/v1/jobs/applications/', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                 const application = await response.json();
                 
                 this.showConfirmation({
                     institution: this.currentJob.institution || this.currentJob.company,
                     id: application.id || 'APP-'+Date.now(),
                     jobTitle: this.currentJob.title,
                     status: 'Submitted'
                 });
                 
                 this.closeModal();
                 
                 // Refresh parent logic if exists
                 if (typeof loadDashboardData === 'function') {
                    loadDashboardData();
                 }
                 // If on jobs page, maybe refresh list? 
                 if (typeof loadJobs === 'function') {
                     loadJobs();
                 }
            } else {
                const error = await response.json();
                console.error('Application error:', error);
                
                // Handle specific field errors
                let verifyMsg = '';
                if (error.resume) verifyMsg += `\nResume: ${error.resume}`;
                if (error.job) verifyMsg += `\nJob: ${error.job}`;
                
                alert((error.message || error.detail || 'Application failed.') + verifyMsg);
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit application: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }



    /**
     * Save application via API
     */
    async saveApplication(application) {
        // This is handled by submitApplication directly now, but we keep the method signature or just remove it.
        // For compatibility with the flow, we'll let submitApplication handle the API call.
        // This method is now redundant for API flow but kept empty to avoid breaking legacy calls if any.
    }

    /**
     * Show application confirmation
     */
    showConfirmation(application) {
        const confirmationHTML = `
            <div class="application-success-overlay">
                <div class="application-success-card">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Application Submitted Successfully!</h2>
                    <p>Your application has been sent to <strong>${application.institution}</strong></p>
                    <div class="application-details">
                        <div class="detail-row">
                            <span>Application ID:</span>
                            <strong>${application.id}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Position:</span>
                            <strong>${application.jobTitle}</strong>
                        </div>
                        <div class="detail-row">
                            <span>Status:</span>
                            <strong style="color: #86c540;">Submitted</strong>
                        </div>
                    </div>
                    <p class="next-steps">The employer will review your application and contact you if shortlisted.</p>
                    <button class="btn-primary" onclick="this.parentElement.parentElement.remove()">
                        Close
                    </button>
                </div>
            </div>
            <style>
                .application-success-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 20000;
                    animation: fadeIn 0.3s ease;
                }
                .application-success-card {
                    background: white;
                    border-radius: 20px;
                    padding: 3rem;
                    text-align: center;
                    max-width: 500px;
                    animation: slideUp 0.5s ease;
                }
                .success-icon {
                    font-size: 5rem;
                    color: #86c540;
                    margin-bottom: 1rem;
                }
                .application-success-card h2 {
                    color: #2c3e50;
                    margin-bottom: 0.5rem;
                }
                .application-details {
                    background: #f8fafc;
                    padding: 1.5rem;
                    border-radius: 12px;
                    margin: 2rem 0;
                    text-align: left;
                }
                .application-details .detail-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid #e2e8f0;
                }
                .application-details .detail-row:last-child {
                    border-bottom: none;
                }
                .next-steps {
                    color: #64748b;
                    margin: 1rem 0;
                }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', confirmationHTML);
    }

    /**
     * Generate unique application ID
     */
    generateApplicationId() {
        return 'APP' + Date.now().toString().substr(-8);
    }
}

// Create global instance
const jobApplicationModal = new JobApplicationModal();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JobApplicationModal;
}
