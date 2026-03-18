/**
 * TechSkillio Route Guard
 * Prevents unauthorized access to protected pages.
 * 
 * Usage: Add a data-required-role attribute to a <script> tag that loads this file.
 *   - data-required-role="admin"  → Only allows admin/superadmin users
 *   - data-required-role="user"   → Only allows authenticated users (any role)
 * 
 * Example:
 *   
 * 
 * IMPORTANT: This is a CLIENT-SIDE guard only. It prevents casual unauthorized
 * access but cannot replace server-side authorization. Always enforce permissions
 * on the backend API as well.
 */

(function () {
    'use strict';

    // Determine required role from the script tag's data attribute
    const currentScript = document.currentScript;
    const requiredRole = currentScript ? currentScript.getAttribute('data-required-role') : 'user';

    // Login page URLs
    const ADMIN_LOGIN_URL = 'admin-login.html';
    const USER_LOGIN_URL = 'login.html';

    // Read auth state from localStorage
    const accessToken = localStorage.getItem('access_token');
    const userType = localStorage.getItem('userType');

    /**
     * Check if user has a valid access token
     */
    function isAuthenticated() {
        return !!accessToken;
    }

    /**
     * Check if user is an admin/superadmin
     */
    function isAdmin() {
        if (!userType) return false;
        const adminRoles = ['admin', 'superadmin', 'super_admin', 'staff'];
        return adminRoles.includes(userType.toLowerCase());
    }

    /**
     * Redirect to the appropriate login page
     */
    function redirectToLogin(loginUrl) {
        // Store the intended destination so login can redirect back
        const currentPage = window.location.href;
        sessionStorage.setItem('redirectAfterLogin', currentPage);
        window.location.replace(loginUrl);
    }

    /**
     * Hide page content until auth check passes (prevents flash of content)
     */
    function hidePageContent() {
        document.documentElement.style.visibility = 'hidden';
        document.documentElement.style.opacity = '0';
    }

    /**
     * Show page content after auth check passes
     */
    function showPageContent() {
        document.documentElement.style.visibility = 'visible';
        document.documentElement.style.opacity = '1';
    }

    // ── GUARD LOGIC ────────────────────────────────────────────

    // Hide content immediately to prevent flash of protected content
    hidePageContent();

    if (requiredRole === 'admin') {
        // Admin pages require both authentication AND admin role
        if (!isAuthenticated()) {
            redirectToLogin(ADMIN_LOGIN_URL);
            return; // Stop execution
        }
        if (!isAdmin()) {
            // User is logged in but not an admin — redirect to admin login
            redirectToLogin(ADMIN_LOGIN_URL);
            return;
        }
    } else {
        // Regular user pages just require authentication
        if (!isAuthenticated()) {
            redirectToLogin(USER_LOGIN_URL);
            return;
        }
    }

    // Auth check passed — show the page
    showPageContent();

})();
