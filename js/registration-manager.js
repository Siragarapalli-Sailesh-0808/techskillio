/**
 * TechSkillio Registration Manager
 * Handles all registration API calls to the backend.
 * Uses window.API_BASE_URL from js/api-config.js (load that first).
 */

function getApiBaseUrl() {
    const url = (typeof window !== 'undefined' && window.API_BASE_URL) ? window.API_BASE_URL : '';
    return url.replace(/\/$/, '');
}

function getConnectionErrorMessage(err) {
    const base = getApiBaseUrl();
    if (!base) {
        return 'API URL is not configured. Please ensure js/api-config.js is loaded and sets window.API_BASE_URL.';
    }
    if (err && (err.message === 'Failed to fetch' || err.name === 'TypeError')) {
        return 'Cannot reach the API server at ' + base + '. If you\'re testing locally, ensure the backend is running and CORS allows your origin.';
    }
    return 'Unable to connect to server at ' + base + '. Please check your connection and that the backend is running.';
}

class RegistrationManager {
    /**
     * Register IT Candidate
     */
    async registerITCandidate(formData) {
        return await this._postRequest('/api/v1/auth/register/itcandidate/', formData, 'IT Candidate');
    }

    /**
     * Register IT Vendor
     */
    async registerITVendor(formData) {
        return await this._postRequest('/api/v1/auth/register/itvendor/', formData, 'IT Vendor');
    }

    /**
     * Register Teacher Candidate (Used for Non-Teaching as well)
     */
    async registerTeacherCandidate(formData) {
        return await this._postRequest('/api/v1/auth/register/teachercandidate/', formData, 'Teacher/Non-Teaching Candidate');
    }

    /**
     * Register Teacher Employer
     */
    async registerTeacherEmployer(formData) {
        return await this._postRequest('/api/v1/auth/register/teacheremployer/', formData, 'Teacher Employer');
    }

    /**
     * Helper method for standardized POST requests
     */
    async _postRequest(endpoint, formData, context) {
        const baseUrl = getApiBaseUrl();
        if (!baseUrl) {
            return { success: false, error: getConnectionErrorMessage(), networkError: true };
        }
        try {
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data: data };
            } else {
                return {
                    success: false,
                    error: data.message || data.detail || `${context} registration failed`,
                    errors: data.errors || data,
                    status: response.status
                };
            }
        } catch (error) {
            console.error(`${context} registration error:`, error);
            return {
                success: false,
                error: getConnectionErrorMessage(error),
                networkError: true
            };
        }
    }

    /**
     * Submit K12 Lead
     */
    async submitK12Lead(formData) {
        const baseUrl = getApiBaseUrl();
        if (!baseUrl) {
            return { success: false, error: getConnectionErrorMessage(), networkError: true };
        }
        try {
            const response = await fetch(`${baseUrl}/api/v1/k12/k12-leads/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                redirect: 'manual'
            });

            if (response.type === 'opaqueredirect' || response.status === 0) {
                return { success: true, data: {} };
            }

            let data = {};
            try { data = await response.json(); } catch (e) { }

            if (response.ok) {
                return { success: true, data: data };
            } else {
                let errorMessage = data.message || data.detail;
                if (!errorMessage && typeof data === 'object') {
                    const messages = [];
                    for (const [key, value] of Object.entries(data)) {
                        messages.push(`${key}: ${Array.isArray(value) ? value.join(', ') : value}`);
                    }
                    if (messages.length > 0) errorMessage = messages.join(' | ');
                }

                return {
                    success: false,
                    error: errorMessage || 'Submission failed (400 Bad Request)',
                    errors: data.errors || data,
                    status: response.status
                };
            }
        } catch (error) {
            console.error('K12 Lead submission error:', error);
            return { success: false, error: getConnectionErrorMessage(error), networkError: true };
        }
    }

    /**
     * Upload file (resume, certificates, etc.)
     */
    async uploadFile(file, fileType = 'document') {
        const baseUrl = getApiBaseUrl();
        if (!baseUrl) return { success: false, error: getConnectionErrorMessage() };

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', fileType);

            const response = await fetch(`${baseUrl}/api/v1/upload/`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.url) {
                return { success: true, url: data.url };
            } else {
                return { success: false, error: data.message || 'File upload failed' };
            }
        } catch (error) {
            console.error('File upload error:', error);
            return { success: false, error: getConnectionErrorMessage(error) };
        }
    }
}

// Create global instance
const registrationManager = new RegistrationManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RegistrationManager;
}