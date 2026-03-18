// Load header.html into all pages
(function () {
    // Create placeholder for header if it doesn't exist
    if (!document.getElementById('header-placeholder')) {
        const placeholder = document.createElement('div');
        placeholder.id = 'header-placeholder';
        document.body.insertBefore(placeholder, document.body.firstChild);
    }

    // Inject Header CSS
    if (!document.querySelector('link[href="css/header.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/header.css';
        document.head.appendChild(link);
    }

    // Fetch and insert header
    fetch('header.html')
        .then(response => response.text())
        .then(html => {
            const headerPlaceholder = document.getElementById('header-placeholder');

            // Remove script tags from HTML to prevent double execution or errors
            // formatting the html string finding <script> tags and removing them is complex
            // safer to just let them be validation constraints or remove them from source file later
            // But we will remove them from header.html source file anyway.
            headerPlaceholder.innerHTML = html;

            // We do NOT need to manually re-execute scripts because we are moving logic here
            // But if there are other scripts (like font awesome CDN), they need to load.
            // For now, assuming only our logic needs to run. 
            // Re-executing standard CDNs is fine via the existing logic if needed, 
            // but ideally we keep our logic separate.

            // Execute external scripts (CDNs) if any found
            const scripts = headerPlaceholder.querySelectorAll('script');
            scripts.forEach(script => {
                if (script.src) {
                    const newScript = document.createElement('script');
                    newScript.src = script.src;
                    document.body.appendChild(newScript);
                }
            });

            // Initialize Header Logic
            // valid timeout to ensure DOM is ready
            setTimeout(() => {
                initializeHeader();
            }, 50);
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });

    // ========== INITIALIZATION ==========
    function initializeHeader() {
        initMobileMenu();
        initDropdowns();
        initApplyPopup();
        initAuth();
    }

    // ========== UI FUNCTIONS ==========
    function initMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function () {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }

    function initDropdowns() {
        // Desktop & Mobile Dropdowns
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');

            if (toggle) {
                toggle.addEventListener('click', function (e) {
                    if (window.innerWidth <= 767) {
                        e.preventDefault();
                        e.stopPropagation();
                        // Close others
                        dropdowns.forEach(d => {
                            if (d !== dropdown) d.classList.remove('open');
                        });
                        dropdown.classList.toggle('open');
                    }
                });
            }

            if (menu) {
                menu.addEventListener('click', function (e) {
                    e.stopPropagation();
                });
            }
        });

        // Close when clicking item
        const dropdownLinks = document.querySelectorAll('.dropdown-item');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function () {
                dropdowns.forEach(d => d.classList.remove('open'));
            });
        });
    }

    // ========== APPLY POPUP FUNCTIONS ==========
    function initApplyPopup() {
        // Functions exposed to window for HTML onclick access
        window.openApplyPopup = function () {
            const popup = document.getElementById("applyPopup");
            if (popup) popup.style.display = "block";
        };

        window.closeApplyPopup = function () {
            const popup = document.getElementById("applyPopup");
            if (popup) popup.style.display = "none";
        };

        window.validateForm = function () {
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const resume = document.getElementById("resume").value;

            if (!name || !email || !phone || !resume) {
                alert("Please fill in all required fields.");
                return false;
            }

            const phonePattern = /^[0-9]{10}$/;
            if (!phonePattern.test(phone)) {
                alert("Please enter a valid 10-digit phone number.");
                return false;
            }

            alert("Application submitted successfully!");
            window.closeApplyPopup();
            document.getElementById("jobForm").reset();
            return false;
        };

        // Close popup when clicking outside
        window.addEventListener('click', function (event) {
            const popup = document.getElementById("applyPopup");
            if (event.target === popup) {
                window.closeApplyPopup();
            }
        });
    }

    // ========== AUTHENTICATION SYSTEM ==========
    function initAuth() {
        // API_BASE_URL is set in js/api-config.js (load that script first)

        // UI Helpers
        window.showLoginError = function (message) {
            const errorDiv = document.getElementById("loginError");
            if (errorDiv) {
                errorDiv.textContent = message;
                errorDiv.style.display = "block";
            }
        };

        window.hideLoginError = function () {
            const errorDiv = document.getElementById("loginError");
            if (errorDiv) errorDiv.style.display = "none";
        };

        // Modal Functions
        window.openLoginModal = function () {
            const modal = document.getElementById("loginModal");
            if (modal) modal.style.display = "block";
        };

        window.closeLoginModal = function () {
            const modal = document.getElementById("loginModal");
            if (modal) {
                modal.style.display = "none";
                const form = document.getElementById("loginForm");
                if (form) form.reset();
                window.hideLoginError();
            }
        };

        // Close modal when clicking outside
        window.addEventListener('click', function (event) {
            const loginModal = document.getElementById("loginModal");
            if (event.target === loginModal) {
                window.closeLoginModal();
            }
        });

        // Login Handler
        window.handleLogin = async function (event) {
            event.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;
            const userType = document.getElementById("userTypeSelect").value;
            const rememberMe = document.getElementById("rememberMe").checked;

            if (!email || !password || !userType) {
                window.showLoginError("Please fill in all fields");
                return;
            }

            const submitBtn = document.getElementById("loginSubmitBtn");
            const btnText = document.getElementById("loginBtnText");
            const btnLoader = document.getElementById("loginBtnLoader");

            submitBtn.disabled = true;
            btnText.style.display = "none";
            btnLoader.style.display = "inline-block";
            window.hideLoginError();

            try {
                const response = await fetch(`${window.API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, userType })
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    const storage = rememberMe ? localStorage : sessionStorage;
                    storage.setItem('authToken', data.token);
                    storage.setItem('refreshToken', data.refreshToken);
                    storage.setItem('userId', data.userId);
                    storage.setItem('userType', data.userType);
                    storage.setItem('userProfile', JSON.stringify(data.profile));

                    updateAuthUI();
                    window.closeLoginModal();
                    redirectToDashboard(data.userType);
                } else {
                    // Handle error response
                    let errorMessage = '';
                    if (response.status === 423) {
                        errorMessage = 'Your account has been blocked or suspended. Please contact support.';
                    } else if (response.status === 403) {
                        if (data.message && data.message.toLowerCase().includes('verify')) {
                            errorMessage = 'Please verify your email address before logging in. Check your inbox for the verification link.';
                        } else {
                            errorMessage = data.message || 'Access denied. Please check your user type and try again.';
                        }
                    } else if (response.status === 404) {
                        errorMessage = 'User not found. Please check your email address or register first.';
                    } else if (response.status === 401) {
                        errorMessage = 'Invalid password. Please try again.';
                    } else if (data.errors) {
                        errorMessage = Object.values(data.errors).join(', ');
                    } else {
                        errorMessage = data.message || 'Invalid credentials. Please try again.';
                    }
                    window.showLoginError(errorMessage);
                }
            } catch (error) {
                console.error('Login error:', error);
                // Demo mode fallback removed for production, but keeping error alert
                window.showLoginError("Unable to connect to server. Please ensure backend is running.");
            } finally {
                submitBtn.disabled = false;
                btnText.style.display = "inline";
                btnLoader.style.display = "none";
            }
        };

        // Logout Helper
        window.logout = function () {
            // Clear all auth data from both localStorage and sessionStorage
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userType');
            localStorage.removeItem('userProfile');

            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('userEmail');
            sessionStorage.removeItem('userType');
            sessionStorage.removeItem('userProfile');

            // Update UI to show logged out state
            updateAuthUI();

            // Redirect to home page
            window.location.href = 'index.html';
        };

        // User Menu Toggle
        window.toggleUserMenu = function () {
            const userMenu = document.getElementById("userMenu");
            if (userMenu) userMenu.classList.toggle("show");
        };

        // Close user menu when clicking outside
        document.addEventListener('click', function (event) {
            const userDropdown = document.getElementById("userDropdown");
            const userMenu = document.getElementById("userMenu");
            if (userDropdown && !userDropdown.contains(event.target)) {
                if (userMenu) userMenu.classList.remove("show");
            }
        });

        // Helper: Dashboard URL
        function getDashboardUrl(userType) {
            // All user types now use the unified dashboard
            return 'dashboard.html';
        }

        // Helper: Redirect
        function redirectToDashboard(userType) {
            const url = getDashboardUrl(userType);
            if (url !== '#') {
                setTimeout(() => { window.location.href = url; }, 500);
            }
        }

        // Helper: User Type Label
        function getUserTypeLabel(userType) {
            const labels = {
                'it_candidate': 'IT Candidate',
                'it_vendor': 'IT Vendor',
                'teacher_candidate': 'Teacher',
                'teacher_candidate_nonteaching': 'Teacher (Non-Teaching)',
                'teacher_employer': 'School/Institute',
                'teacher_employer_nonteaching': 'School/Institute (Non-Teaching)',
                'admin': 'Administrator'
            };
            return labels[userType] || 'User';
        }

        // Update Auth UI
        function updateAuthUI() {
            // Check for new auth system tokens (access_token)
            const accessToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
            const userProfileStr = localStorage.getItem('userProfile') || sessionStorage.getItem('userProfile');
            const userType = localStorage.getItem('userType') || sessionStorage.getItem('userType');
            const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');

            let userProfile = {};
            try {
                userProfile = JSON.parse(userProfileStr || '{}');
            } catch (e) {
                console.error('Error parsing user profile', e);
            }

            const btnLogin = document.getElementById("btnLogin");
            const userDropdown = document.getElementById("userDropdown");

            if (accessToken) {
                // LOGGED IN - Show user dropdown, hide login button
                if (btnLogin) btnLogin.style.display = "none";
                if (userDropdown) userDropdown.style.display = "block";

                // Hide top-level nav links
                const navLinksItems = document.querySelectorAll('.nav-menu > .nav-link');
                navLinksItems.forEach(item => item.style.display = "none");

                // Get user name from profile
                const userName = userProfile.full_name || userProfile.name || userEmail || 'User';
                const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

                const initialsEl = document.getElementById("userInitials");
                const nameEl = document.getElementById("userName");
                const typeEl = document.getElementById("userType");

                if (initialsEl) initialsEl.textContent = initials;
                if (nameEl) nameEl.textContent = userName;
                if (typeEl) typeEl.textContent = getUserTypeLabel(userType);

                // Update dashboard link based on user type
                const dashboardLink = document.getElementById("dashboardLink");
                if (dashboardLink) {
                    dashboardLink.href = getDashboardUrlByType(userType);
                }

                // Update profile link
                const profileLink = document.getElementById("profileLink");
                if (profileLink) profileLink.href = 'profile.html';
            } else {
                // NOT LOGGED IN - Show login button, hide user dropdown
                if (btnLogin) btnLogin.style.display = "flex";
                if (userDropdown) userDropdown.style.display = "none";

                // Show top-level nav links
                const navLinksItems = document.querySelectorAll('.nav-menu > .nav-link');
                navLinksItems.forEach(item => item.style.display = "");
            }
        }

        // Get dashboard URL based on user type
        function getDashboardUrlByType(userType) {
            const dashboardMapping = {
                'it_candidate': 'it-candidate-dashboard.html',
                'it_vendor': 'it-vendor-dashboard.html',
                'teacher_candidate': 'teacher-candidate-dashboard.html',
                'teacher_employer': 'teacher-employer-dashboard.html',
                'admin': 'admin-dashboard.html'
            };
            return dashboardMapping[userType] || 'dashboard.html';
        }


        // Expose updateAuthUI globally if needed, or just run it
        // Initial run handled in initAuth()

        // Run immediate check
        updateAuthUI();

        // Attach listeners for User Toggle & Logout (if not using onclick in HTML)
        // Note: header.html might not have onclicks for these specific elements
        const userToggle = document.getElementById('userToggle');
        if (userToggle) {
            userToggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                window.toggleUserMenu();
            });
        }

        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', function (e) {
                e.preventDefault();
                window.logout();
            });
        }
    }

    // Define global placeholder for register options
    window.showRegisterOptions = function () {
        alert('Please use the dropdown to select registration type.');
    };

})();
