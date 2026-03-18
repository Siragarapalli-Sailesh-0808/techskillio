/**
 * TechSkillio Authentication Manager
 * Handles JWT token management, storage, and API requests
 * Uses window.API_BASE_URL from js/api-config.js (load that first).
 */

class AuthManager {
    constructor() {
        this.accessToken = null;
        this.refreshToken = null;
        this.loadTokens();
    }

    /**
     * Load tokens from localStorage
     */
    loadTokens() {
        this.accessToken = localStorage.getItem('access_token');
        this.refreshToken = localStorage.getItem('refresh_token');
    }

    /**
     * Save tokens to localStorage
     */
    saveTokens(accessToken, refreshToken) {
        if (accessToken) {
            this.accessToken = accessToken;
            localStorage.setItem('access_token', accessToken);
        }
        if (refreshToken) {
            this.refreshToken = refreshToken;
            localStorage.setItem('refresh_token', refreshToken);
        }
    }

    /**
     * Clear all authentication data
     */
    clearAuth() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userType');
        localStorage.removeItem('userProfile');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.accessToken;
    }

    /**
     * Get access token
     */
    getAccessToken() {
        return this.accessToken;
    }

    /**
     * Get refresh token
     */
    getRefreshToken() {
        return this.refreshToken;
    }

    /**
     * Login user
     */
    async login(email, password) {
        try {
            console.log(`Attempting login to: ${window.API_BASE_URL}/api/v1/auth/login/`);
            const response = await fetch(`${window.API_BASE_URL}/api/v1/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok && data.access && data.refresh) {
                // Store tokens
                this.saveTokens(data.access, data.refresh);

                return {
                    success: true,
                    data: data
                };
            } else {
                return {
                    success: false,
                    error: data.message || data.detail || 'Login failed',
                    status: response.status,
                    data: data
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: `Unable to connect to server at ${window.API_BASE_URL}. Check if backend is running.`,
                networkError: true
            };
        }
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshAccessToken() {
        if (!this.refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await fetch(`${window.API_BASE_URL}/api/v1/auth/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh: this.refreshToken
                })
            });

            const data = await response.json();

            if (response.ok && data.access) {
                this.saveTokens(data.access, null);
                return data.access;
            } else {
                // Refresh token is invalid or expired
                this.clearAuth();
                throw new Error('Session expired. Please login again.');
            }
        } catch (error) {
            this.clearAuth();
            throw error;
        }
    }

    /**
     * Make authenticated API request
     * Automatically attaches Authorization header with TSK prefix
     */
    async apiRequest(endpoint, options = {}) {
        // Ensure we have an access token
        if (!this.accessToken) {
            throw new Error('Not authenticated');
        }

        // Prepare headers
        const headers = {
            ...options.headers,
            'Authorization': `TSK ${this.accessToken}`
        };

        // Only add Content-Type if not FormData
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        // Make the request
        let response = await fetch(`${window.API_BASE_URL}${endpoint}`, {
            ...options,
            headers: headers
        });

        // If unauthorized, try to refresh token
        if (response.status === 401) {
            try {
                await this.refreshAccessToken();

                // Retry the request with new token
                headers['Authorization'] = `TSK ${this.accessToken}`;
                response = await fetch(`${window.API_BASE_URL}${endpoint}`, {
                    ...options,
                    headers: headers
                });
            } catch (refreshError) {
                // Refresh failed, redirect to login
                window.location.href = 'login.html';
                throw new Error('Session expired. Please login again.');
            }
        }

        return response;
    }

    /**
     * Get current user profile
     * Fetches user data from /api/v1/auth/me/
     */
    async getUserProfile() {
        try {
            const response = await this.apiRequest('/api/v1/auth/me/', {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();

                // Store user data in localStorage
                if (data.user) {
                    localStorage.setItem('userId', data.user.id);
                    localStorage.setItem('userEmail', data.user.email);
                }

                if (data.user_type) {
                    localStorage.setItem('userType', data.user_type);
                }

                if (data.profile) {
                    localStorage.setItem('userProfile', JSON.stringify(data.profile));
                }

                return {
                    success: true,
                    data: data
                };
            } else {
                const errorData = await response.json();
                return {
                    success: false,
                    error: errorData.message || errorData.detail || 'Failed to fetch profile',
                    status: response.status
                };
            }
        } catch (error) {
            console.error('Get profile error:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch profile',
                networkError: true
            };
        }
    }



    /**
     * Change password (authenticated)
     */
    async changePassword(oldPassword, newPassword) {
        try {
            const response = await this.apiRequest('/api/v1/auth/change-password/', {
                method: 'POST',
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    message: data.message || 'Password changed successfully'
                };
            } else {
                return {
                    success: false,
                    error: data.message || data.detail || 'Failed to change password',
                    data: data
                };
            }
        } catch (error) {
            console.error('Change password error:', error);
            return {
                success: false,
                error: error.message || 'Unable to change password'
            };
        }
    }

    /**
     * Request password reset (unauthenticated)
     */
    async requestPasswordReset(email) {
        try {
            const response = await fetch(`${window.API_BASE_URL}/api/v1/auth/password-reset/request/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                })
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    message: data.message || 'Reset code sent to your email'
                };
            } else {
                return {
                    success: false,
                    error: data.message || data.detail || 'Failed to send reset code'
                };
            }
        } catch (error) {
            console.error('Password reset request error:', error);
            return {
                success: false,
                error: 'Unable to connect to server'
            };
        }
    }

    /**
     * Verify reset code
     */
    async verifyResetCode(email, code) {
        try {
            const response = await fetch(`${window.API_BASE_URL}/api/v1/auth/password-reset/verify/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    code: code
                })
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    token: data.reset_token || data.token
                };
            } else {
                return {
                    success: false,
                    error: data.message || data.detail || 'Invalid or expired code'
                };
            }
        } catch (error) {
            console.error('Verify reset code error:', error);
            return {
                success: false,
                error: 'Unable to verify code'
            };
        }
    }

    /**
     * Reset password with token
     */
    async resetPassword(resetToken, newPassword) {
        try {
            const response = await fetch(`${window.API_BASE_URL}/api/v1/auth/password-reset/confirm/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: resetToken,
                    new_password: newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    message: data.message || 'Password reset successfully'
                };
            } else {
                return {
                    success: false,
                    error: data.message || data.detail || 'Failed to reset password'
                };
            }
        } catch (error) {
            console.error('Reset password error:', error);
            return {
                success: false,
                error: 'Unable to reset password'
            };
        }
    }

    /**
     * Logout user
     */
    logout() {
        this.clearAuth();
        window.location.href = 'login.html';
    }
}

// Create global instance
const authManager = new AuthManager();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
