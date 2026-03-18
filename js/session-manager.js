// Session Management Service
// Handles user authentication, session storage, and security features (static implementation)

class SessionManager {
    constructor() {
        this.sessionKey = 'userSession';
        this.init();
    }

    /**
     * Initialize session manager
     */
    init() {
        this.checkSessionExpiry();
    }

    /**
     * Create a new session
     */
    createSession(userData) {
        const session = {
            userId: this.generateUserId(),
            email: userData.email,
            userType: userData.userType || 'candidate',
            fullName: userData.fullName || '',
            loginTime: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
            isActive: true
        };

        try {
            // Simulate password hashing (in production, this would be server-side)
            if (userData.password) {
                session.passwordHash = this.hashPassword(userData.password);
            }

            localStorage.setItem(this.sessionKey, JSON.stringify(session));
            console.log('Session created:', session);
            return session;
        } catch (error) {
            console.error('Failed to create session:', error);
            return null;
        }
    }

    /**
     * Get current session
     */
    getSession() {
        try {
            const session = localStorage.getItem(this.sessionKey);
            if (!session) return null;

            const sessionData = JSON.parse(session);
            
            // Check if session has expired
            if (new Date(sessionData.expiresAt) < new Date()) {
                this.destroySession();
                return null;
            }

            return sessionData;
        } catch (error) {
            console.error('Failed to get session:', error);
            return null;
        }
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return this.getSession() !== null;
    }

    /**
     * Get user type (candidate/employer)
     */
    getUserType() {
        const session = this.getSession();
        return session ? session.userType : null;
    }

    /**
     * Update session data
     */
    updateSession(updates) {
        const session = this.getSession();
        if (!session) return false;

        const updatedSession = { ...session, ...updates };
        
        try {
            localStorage.setItem(this.sessionKey, JSON.stringify(updatedSession));
            return true;
        } catch (error) {
            console.error('Failed to update session:', error);
            return false;
        }
    }

    /**
     * Destroy session (logout)
     */
    destroySession() {
        localStorage.removeItem(this.sessionKey);
        console.log('Session destroyed');
    }

    /**
     * Check session expiry
     */
    checkSessionExpiry() {
        const session = this.getSession();
        if (session && new Date(session.expiresAt) < new Date()) {
            this.destroySession();
            alert('Your session has expired. Please log in again.');
            window.location.href = 'login.html';
        }
    }

    /**
     * Extend session (refresh expiry)
     */
    extendSession() {
        const session = this.getSession();
        if (!session) return false;

        session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        
        try {
            localStorage.setItem(this.sessionKey, JSON.stringify(session));
            return true;
        } catch (error) {
            console.error('Failed to extend session:', error);
            return false;
        }
    }

    /**
     * Simulate password hashing (client-side for demo only)
     * In production, passwords should NEVER be hashed client-side
     */
    hashPassword(password) {
        // Simple hash simulation (NOT SECURE - for demo only)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'hash_' + Math.abs(hash).toString(16);
    }

    /**
     * Verify password (static implementation)
     */
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    /**
     * Generate unique user ID
     */
    generateUserId() {
        return 'USER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Require authentication (redirect if not logged in)
     */
    requireAuth(redirectUrl = 'login.html') {
        if (!this.isLoggedIn()) {
            // Store current page to return after login
            localStorage.setItem('returnUrl', window.location.href);
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    /**
     * Require specific user type
     */
    requireUserType(requiredType, redirectUrl = 'index.html') {
        const userType = this.getUserType();
        if (userType !== requiredType) {
            alert(`This page is only accessible to ${requiredType}s`);
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    /**
     * Get return URL after login
     */
    getReturnUrl() {
        const returnUrl = localStorage.getItem('returnUrl');
        localStorage.removeItem('returnUrl');
        return returnUrl || 'index.html';
    }
}

// Profile Visibility Controls
class ProfileVisibilityManager {
    constructor() {
        this.visibilityKey = 'profileVisibility';
        this.loadSettings();
    }

    /**
     * Load visibility settings
     */
    loadSettings() {
        try {
            const settings = localStorage.getItem(this.visibilityKey);
            this.settings = settings ? JSON.parse(settings) : this.getDefaultSettings();
        } catch (error) {
            this.settings = this.getDefaultSettings();
        }
    }

    /**
     * Get default visibility settings
     */
    getDefaultSettings() {
        return {
            profileVisible: true,
            showEmail: false,
            showPhone: false,
            showResume: true,
            showSalaryExpectations: true,
            showCurrentEmployer: false,
            allowDirectContact: true,
            searchable: true
        };
    }

    /**
     * Update visibility settings
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        
        try {
            localStorage.setItem(this.visibilityKey, JSON.stringify(this.settings));
            return true;
        } catch (error) {
            console.error('Failed to update visibility settings:', error);
            return false;
        }
    }

    /**
     * Get current settings
     */
    getSettings() {
        return { ...this.settings };
    }

    /**
     * Check if field should be visible
     */
    isFieldVisible(fieldName) {
        return this.settings[fieldName] !== false;
    }

    /**
     * Make profile private
     */
    makePrivate() {
        this.updateSettings({
            profileVisible: false,
            searchable: false,
            allowDirectContact: false
        });
    }

    /**
     * Make profile public
     */
    makePublic() {
        this.updateSettings({
            profileVisible: true,
            searchable: true,
            allowDirectContact: true
        });
    }
}

// Create global instances
const sessionManager = new SessionManager();
const profileVisibility = new ProfileVisibilityManager();

// Auto-extend session on activity
let activityTimer;
document.addEventListener('mousemove', () => {
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
        if (sessionManager.isLoggedIn()) {
            sessionManager.extendSession();
        }
    }, 5 * 60 * 1000); // Extend after 5 minutes of activity
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SessionManager, ProfileVisibilityManager };
}
