// Admin Sidebar Loader
// Dynamically loads the shared admin sidebar into all admin pages

document.addEventListener('DOMContentLoaded', function() {
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    
    if (sidebarPlaceholder) {
        fetch('components/admin-sidebar.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load sidebar');
                }
                return response.text();
            })
            .then(html => {
                sidebarPlaceholder.outerHTML = html;
                
                // Set active nav item
                setActiveNavItem();
            })
            .catch(error => {
                console.error('Error loading sidebar:', error);
                // Fallback - render inline sidebar
                renderFallbackSidebar(sidebarPlaceholder);
            });
    }
});

function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'admin-dashboard.html';
    const pageNavMap = {
        'admin-dashboard.html': 'nav-dashboard',
        'admin-it-candidates.html': 'nav-it-candidates',
        'admin-teachers.html': 'nav-teachers',
        'admin-employers.html': 'nav-employers',
        'admin-k12-leads.html': 'nav-k12-leads',
        'admin-job-postings.html': 'nav-job-postings',
        'admin-job-applications.html': 'nav-job-applications',
        'admin-payments.html': 'nav-payments',
        'admin-settings.html': 'nav-settings'
    };
    
    const navId = pageNavMap[currentPage];
    if (navId) {
        const navItem = document.getElementById(navId);
        if (navItem) navItem.classList.add('active');
    }
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}

function renderFallbackSidebar(placeholder) {
    placeholder.innerHTML = `
        <aside class="sidebar" id="adminSidebar">
            <div class="sidebar-header">
                <img src="tech.png" alt="TechSkillio" class="sidebar-logo">
                <div class="sidebar-brand">
                    <span class="sidebar-brand-name">TechSkillio</span>
                    <span class="sidebar-brand-tagline">Admin Panel</span>
                </div>
            </div>
            <nav class="sidebar-nav">
                <div class="sidebar-section-title">Main</div>
                <ul class="sidebar-menu">
                    <li><a href="admin-dashboard.html" id="nav-dashboard"><i class="fas fa-home"></i> Dashboard</a></li>
                </ul>
                <div class="sidebar-section-title">Management</div>
                <ul class="sidebar-menu">
                    <li><a href="admin-it-candidates.html" id="nav-it-candidates"><i class="fas fa-laptop-code"></i> IT Candidates</a></li>
                    <li><a href="admin-teachers.html" id="nav-teachers"><i class="fas fa-chalkboard-teacher"></i> Teachers</a></li>
                    <li><a href="admin-employers.html" id="nav-employers"><i class="fas fa-building"></i> Employers</a></li>
                    <li><a href="admin-k12-leads.html" id="nav-k12-leads"><i class="fas fa-graduation-cap"></i> K12 Leads</a></li>
                </ul>
                <div class="sidebar-section-title">Jobs</div>
                <ul class="sidebar-menu">
                    <li><a href="admin-job-postings.html" id="nav-job-postings"><i class="fas fa-briefcase"></i> Job Postings</a></li>
                    <li><a href="admin-job-applications.html" id="nav-job-applications"><i class="fas fa-file-alt"></i> Applications</a></li>
                </ul>
                <div class="sidebar-section-title">Finance</div>
                <ul class="sidebar-menu">
                    <li><a href="admin-payments.html" id="nav-payments"><i class="fas fa-credit-card"></i> Payments</a></li>
                </ul>
                <div class="sidebar-section-title">Account</div>
                <ul class="sidebar-menu">
                    <li><a href="admin-settings.html" id="nav-settings"><i class="fas fa-cog"></i> Settings</a></li>
                    <li><a href="admin-login.html" id="nav-logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                </ul>
            </nav>
        </aside>
        <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleMobileSidebar()"></div>
    `;
    setActiveNavItem();
}
