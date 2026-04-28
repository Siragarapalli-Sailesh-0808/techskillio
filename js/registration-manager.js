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

function getUploadErrorMessage(response, data) {
    if (response && (response.status === 413 || response.status === 422)) {
        return 'File size limit exceeded. Please compress the file and upload a version smaller than 2 MB.';
    }

    const serverMsg = (data && (data.message || data.detail || data.error)) || '';
    if (typeof serverMsg === 'string') {
        const lower = serverMsg.toLowerCase();
        if (lower.includes('too large') || lower.includes('file size') || lower.includes('size limit') || lower.includes('payload')) {
            return 'File size limit exceeded. Please compress the file and upload a version smaller than 2 MB.';
        }
    }

    return serverMsg || 'File upload failed. Please verify file type and size, then try again.';
}

function toDisplayFieldName(key) {
    if (!key) return 'Field';
    const normalized = String(key).replace(/[_\-]+/g, ' ').trim();
    if (!normalized) return 'Field';
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function extractApiErrorMessages(payload, parentKey) {
    const out = [];
    const prefix = parentKey ? toDisplayFieldName(parentKey) + ': ' : '';

    if (payload == null) return out;

    if (typeof payload === 'string' || typeof payload === 'number' || typeof payload === 'boolean') {
        out.push(prefix + String(payload));
        return out;
    }

    if (Array.isArray(payload)) {
        payload.forEach(function (item) {
            out.push.apply(out, extractApiErrorMessages(item, parentKey));
        });
        return out;
    }

    if (typeof payload === 'object') {
        const topPriority = ['message', 'detail', 'error', 'non_field_errors'];
        topPriority.forEach(function (k) {
            if (payload[k] != null) {
                out.push.apply(out, extractApiErrorMessages(payload[k], k === 'non_field_errors' ? null : parentKey));
            }
        });

        Object.keys(payload).forEach(function (k) {
            if (topPriority.indexOf(k) !== -1) return;
            out.push.apply(out, extractApiErrorMessages(payload[k], k));
        });
    }

    return out;
}

function getDetailedApiErrorMessage(data, fallbackMessage) {
    const messages = extractApiErrorMessages(data)
        .map(function (m) { return String(m).trim(); })
        .filter(Boolean);

    const uniqueMessages = messages.filter(function (msg, idx) {
        return messages.indexOf(msg) === idx;
    });

    if (uniqueMessages.length) {
        return 'Registration could not be completed. Please fix the following:\n- ' + uniqueMessages.join('\n- ');
    }

    return fallbackMessage;
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

            let data = {};
            try {
                data = await response.json();
            } catch (e) {
                data = {};
            }

            if (response.ok) {
                return { success: true, data: data };
            } else {
                const fallback = `${context} registration failed`;
                return {
                    success: false,
                    error: getDetailedApiErrorMessage(data, fallback),
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

        if (file && typeof file.size === 'number' && file.size > 2 * 1024 * 1024) {
            return {
                success: false,
                error: 'File size limit exceeded. Please compress the file and upload a version smaller than 2 MB.'
            };
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

            const uploadedUrl = data.url || data.file_url || data.fileUrl || data.resume_url || data.resumeUrl || data.location || data.path;

            if (response.ok && uploadedUrl) {
                return { success: true, url: uploadedUrl, data: data };
            } else {
                return { success: false, error: getUploadErrorMessage(response, data) };
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