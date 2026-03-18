// Email Notification Service
// This is a static implementation that logs emails to console
// In production, this would integrate with an email service provider (SendGrid, AWS SES, etc.)

class EmailService {
    constructor() {
        this.templates = {
            // Candidate Templates
            'candidate-welcome': 'email-templates/candidate-welcome.html',
            'candidate-application-submitted': 'email-templates/candidate-application-submitted.html',
            'candidate-interview-scheduled': 'email-templates/candidate-interview-scheduled.html',
            'candidate-profile-viewed': 'email-templates/candidate-profile-viewed.html',
            
            // Employer Templates
            'employer-welcome': 'email-templates/employer-welcome.html',
            'employer-new-application': 'email-templates/employer-new-application.html',
            'employer-interview-confirmed': 'email-templates/employer-interview-confirmed.html',
            'employer-subscription-expiring': 'email-templates/employer-subscription-expiring.html',
            
            // Admin Templates
            'admin-new-candidate': 'email-templates/admin-new-candidate.html',
            'admin-new-employer': 'email-templates/admin-new-employer.html',
            'admin-payment-successful': 'email-templates/admin-payment-successful.html'
        };
        
        this.emailQueue = [];
    }

    /**
     * Send an email using a template
     * @param {string} templateName - Name of the email template
     * @param {string} to - Recipient email address
     * @param {object} data - Data to populate the template
     * @param {string} subject - Email subject line
     */
    async sendEmail(templateName, to, data, subject) {
        try {
            // In production, this would:
            // 1. Load the HTML template
            // 2. Replace placeholders with actual data
            // 3. Send via email service provider
            
            const email = {
                id: this.generateEmailId(),
                templateName,
                to,
                subject,
                data,
                timestamp: new Date().toISOString(),
                status: 'queued'
            };
            
            this.emailQueue.push(email);
            
            // Simulate sending
            console.log('📧 EMAIL SENT:', {
                id: email.id,
                template: templateName,
                to: to,
                subject: subject,
                timestamp: email.timestamp
            });
            
            console.log('📝 Email Data:', data);
            
            // Store in localStorage for demo purposes
            this.saveToLocalStorage(email);
            
            return {
                success: true,
                emailId: email.id,
                message: 'Email sent successfully'
            };
            
        } catch (error) {
            console.error('❌ Email sending failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send welcome email to candidate
     */
    async sendCandidateWelcome(candidateData) {
        const data = {
            candidateName: candidateData.fullName,
            candidateType: candidateData.type || 'Teaching',
            email: candidateData.email,
            registrationDate: new Date().toLocaleDateString(),
            profileCompleteness: this.calculateProfileCompleteness(candidateData),
            dashboardUrl: 'http://localhost/teacher-candidate-dashboard.html',
            websiteUrl: 'http://localhost/index.html',
            supportUrl: 'http://localhost/contact-us.html',
            unsubscribeUrl: '#'
        };
        
        return await this.sendEmail(
            'candidate-welcome',
            candidateData.email,
            data,
            'Welcome to TechSkillio - Your Teaching Career Starts Here!'
        );
    }

    /**
     * Send application submitted confirmation to candidate
     */
    async sendApplicationSubmitted(applicationData) {
        const data = {
            candidateName: applicationData.candidateName,
            jobTitle: applicationData.jobTitle,
            institutionName: applicationData.institutionName,
            location: applicationData.location,
            applicationDate: new Date().toLocaleDateString(),
            referenceNumber: this.generateReferenceNumber(),
            applicationTrackingUrl: 'http://localhost/teacher-candidate-dashboard.html#applications'
        };
        
        return await this.sendEmail(
            'candidate-application-submitted',
            applicationData.candidateEmail,
            data,
            `Application Submitted: ${applicationData.jobTitle}`
        );
    }

    /**
     * Send interview scheduled notification to candidate
     */
    async sendInterviewScheduled(interviewData) {
        const data = {
            candidateName: interviewData.candidateName,
            institutionName: interviewData.institutionName,
            jobTitle: interviewData.jobTitle,
            interviewDate: interviewData.date,
            interviewTime: interviewData.time,
            interviewMode: interviewData.mode,
            modeIcon: interviewData.mode === 'Online' ? '💻' : '🏢',
            venueLabel: interviewData.mode === 'Online' ? 'Meeting Link' : 'Venue',
            venueOrLink: interviewData.venueOrLink,
            interviewerName: interviewData.interviewerName,
            calendarLink: '#',
            confirmationLink: '#'
        };
        
        return await this.sendEmail(
            'candidate-interview-scheduled',
            interviewData.candidateEmail,
            data,
            `Interview Scheduled: ${interviewData.jobTitle}`
        );
    }

    /**
     * Send new application notification to employer
     */
    async sendNewApplicationToEmployer(applicationData) {
        const data = {
            employerName: applicationData.employerName,
            candidateName: applicationData.candidateName,
            candidateInitials: this.getInitials(applicationData.candidateName),
            jobTitle: applicationData.jobTitle,
            experience: applicationData.experience,
            qualification: applicationData.qualification,
            location: applicationData.location,
            expectedSalary: applicationData.expectedSalary,
            highlights: applicationData.highlights || [],
            applicationDate: new Date().toLocaleDateString(),
            applicationId: this.generateApplicationId(),
            profileUrl: '#',
            scheduleInterviewUrl: '#'
        };
        
        return await this.sendEmail(
            'employer-new-application',
            applicationData.employerEmail,
            data,
            `New Application: ${applicationData.candidateName} for ${applicationData.jobTitle}`
        );
    }

    /**
     * Send subscription expiring notification to employer
     */
    async sendSubscriptionExpiring(employerData) {
        const data = {
            employerName: employerData.institutionName,
            daysRemaining: employerData.daysRemaining,
            currentPlan: employerData.currentPlan,
            profilesAccessed: employerData.profilesAccessed,
            totalProfiles: employerData.totalProfiles,
            expiryDate: employerData.expiryDate,
            renewalUrl: 'http://localhost/teacher-subscription-plans.html'
        };
        
        return await this.sendEmail(
            'employer-subscription-expiring',
            employerData.email,
            data,
            `Subscription Expiring in ${employerData.daysRemaining} Days`
        );
    }

    /**
     * Send notification to admin about new candidate registration
     */
    async sendAdminNewCandidate(candidateData) {
        const data = {
            candidateName: candidateData.fullName,
            candidateType: candidateData.type || 'Teaching',
            email: candidateData.email,
            phone: candidateData.phone,
            registrationTimestamp: new Date().toLocaleString(),
            profileUrl: '#'
        };
        
        return await this.sendEmail(
            'admin-new-candidate',
            'admin@techskillio.com',
            data,
            `New Candidate Registration: ${candidateData.fullName}`
        );
    }

    /**
     * Send notification to admin about new employer registration
     */
    async sendAdminNewEmployer(employerData) {
        const data = {
            institutionName: employerData.institutionName,
            contactPerson: employerData.contactPerson,
            email: employerData.email,
            phone: employerData.phone,
            location: employerData.location,
            registrationTimestamp: new Date().toLocaleString(),
            profileUrl: '#'
        };
        
        return await this.sendEmail(
            'admin-new-employer',
            'admin@techskillio.com',
            data,
            `New Employer Registration: ${employerData.institutionName}`
        );
    }

    /**
     * Send payment successful notification to admin
     */
    async sendAdminPaymentSuccessful(paymentData) {
        const data = {
            employerName: paymentData.employerName,
            amount: paymentData.amount,
            plan: paymentData.plan,
            paymentId: paymentData.paymentId,
            paymentMethod: paymentData.paymentMethod,
            timestamp: new Date().toLocaleString()
        };
        
        return await this.sendEmail(
            'admin-payment-successful',
            'admin@techskillio.com',
            data,
            `Payment Received: ₹${paymentData.amount} from ${paymentData.employerName}`
        );
    }

    // Helper methods
    generateEmailId() {
        return 'email_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateReferenceNumber() {
        return 'APP' + Date.now().toString().substr(-8);
    }

    generateApplicationId() {
        return 'APPL' + Date.now().toString().substr(-6);
    }

    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substr(0, 2);
    }

    calculateProfileCompleteness(candidateData) {
        // Simple calculation based on filled fields
        const totalFields = 20;
        const filledFields = Object.values(candidateData).filter(v => v && v !== '').length;
        return Math.round((filledFields / totalFields) * 100);
    }

    saveToLocalStorage(email) {
        try {
            const emails = JSON.parse(localStorage.getItem('emailQueue') || '[]');
            emails.push(email);
            localStorage.setItem('emailQueue', JSON.stringify(emails));
        } catch (error) {
            console.error('Failed to save email to localStorage:', error);
        }
    }

    getEmailQueue() {
        try {
            return JSON.parse(localStorage.getItem('emailQueue') || '[]');
        } catch (error) {
            console.error('Failed to retrieve email queue:', error);
            return [];
        }
    }

    clearEmailQueue() {
        localStorage.removeItem('emailQueue');
        this.emailQueue = [];
    }
}

// Create global instance
const emailService = new EmailService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
}
