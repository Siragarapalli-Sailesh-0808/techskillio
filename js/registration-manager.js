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
        return 'Cannot reach the API server at ' + base + '. If you\'re testing locally, ensure the backend is running and CORS allows your origin (e.g. http://127.0.0.1:5500).';
    }
    return 'Unable to connect to server at ' + base + '. Please check your connection and that the backend is running.';
}

class RegistrationManager {
    /**
     * Register IT Candidate
     */
    async registerITCandidate(formData) {
        const baseUrl = getApiBaseUrl();
        if (!baseUrl) {
            return { success: false, error: getConnectionErrorMessage(), networkError: true };
        }
        try {
            const response = await fetch(`${baseUrl}/api/v1/auth/register/itcandidate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    data: data
                };
            } else {
                return {
                    success: false,
                    error: data.message || data.detail || 'Registration failed',
                    errors: data.errors || data,
                    status: response.status
                };
            }
        } catch (error) {
            console.error('IT Candidate registration error:', error);
            return {
                success: false,
                error: getConnectionErrorMessage(error),
                networkError: true
            };
        }
    }

    /**
     * Register IT Vendor
     */
    async registerITVendor(formData) {
        const baseUrl = getApiBaseUrl();
        if (!baseUrl) {
            return { success: false, error: getConnectionErrorMessage(), networkError: true };
        }
        try {
            const response = await fetch(`${baseUrl}/api/v1/auth/register/itvendor/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    data: data
                };
            } else {
                return {
                    success: false,
                    error: data.message || data.detail || 'Registration failed',
                    errors: data.errors || data,
                    status: response.status
                };
            }
        } catch (error) {
            console.error('IT Vendor registration error:', error);
            return {
                success: false,
                error: getConnectionErrorMessage(error),
                networkError: true
            };
        }
    }

    /**
     * Register Teacher Candidate
     */
    async registerTeacherCandidate(formData) {
        const baseUrl = getApiBaseUrl();
        if (!baseUrl) {
            return { success: false, error: getConnectionErrorMessage(), networkError: true };
        }
        try {
            const response = await fetch(`${baseUrl}/api/v1/auth/register/teachercandidate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    data: data
                };
            } else {
                return {
                    success: false,
                    error: data.message || data.detail || 'Registration failed',
                    errors: data.errors || data,
                    status: response.status
                };
            }
        } catch (error) {
            console.error('Teacher Candidate registration error:', error);
            return {
                success: false,
                error: getConnectionErrorMessage(error),
                networkError: true
            };
        }
    }

    /**
     * Register Teacher Employer
     */
    async registerTeacherEmployer(formData) {
        const baseUrl = getApiBaseUrl();
        if (!baseUrl) {
            return { success: false, error: getConnectionErrorMessage(), networkError: true };
        }
        try {
            const response = await fetch(`${baseUrl}/api/v1/auth/register/teacheremployer/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    data: data
                };
            } else {
                return {
                    success: false,
                    error: data.message || data.detail || 'Registration failed',
                    errors: data.errors || data,
                    status: response.status
                };
            }
        } catch (error) {
            console.error('Teacher Employer registration error:', error);
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
            // WORKAROUND: The server redirects to a malformed URL (e.g., .../k12-leads/:1) after successful creation.
            // We use redirect: 'manual' to prevent the browser from following this bad redirect.
            // An opaque redirect response (type: 'opaqueredirect' or status 0) is treated as success.
            const response = await fetch(`${baseUrl}/api/v1/k12/k12-leads/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                redirect: 'manual' 
            });

            // Check for opaque redirect (request succeeded but redirected cross-origin/opaquely)
            if (response.type === 'opaqueredirect' || response.status === 0) {
                 return {
                    success: true,
                    data: {} // We cannot access the body of an opaque response
                };
            }

            // Handle normal responses (if server behavior changes or for other status codes)
            let data = {};
            try {
                data = await response.json();
            } catch (e) {
                console.error('Failed to parse response JSON', e);
            }

            if (response.ok) {
                return {
                    success: true,
                    data: data
                };
            } else {
                // Construct a better error message from DRF field errors
                let errorMessage = data.message || data.detail;
                if (!errorMessage && typeof data === 'object') {
                    // Start collecting error messages from fields
                    const messages = [];
                    for (const [key, value] of Object.entries(data)) {
                        if (Array.isArray(value)) {
                            messages.push(`${key}: ${value.join(', ')}`);
                        } else if (typeof value === 'string') {
                            messages.push(`${key}: ${value}`);
                        }
                    }
                    if (messages.length > 0) {
                        errorMessage = messages.join(' | ');
                    }
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
            return {
                success: false,
                error: getConnectionErrorMessage(error),
                networkError: true
            };
        }
    }

    /**
     * Upload file (for resume, certificates, photos, etc.)
     * Returns the URL of the uploaded file
     */
    async uploadFile(file, fileType = 'document') {
        const baseUrl = getApiBaseUrl();
        if (!baseUrl) {
            return { success: false, error: getConnectionErrorMessage() };
        }
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
                return {
                    success: true,
                    url: data.url
                };
            } else {
                return {
                    success: false,
                    error: data.message || 'File upload failed'
                };
            }
        } catch (error) {
            console.error('File upload error:', error);
            return {
                success: false,
                error: getConnectionErrorMessage(error)
            };
        }
    }
}

// Create global instance
const registrationManager = new RegistrationManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RegistrationManager;
}
