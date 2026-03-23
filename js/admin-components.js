/**
 * Admin Components Loader
 * Dynamically loads sidebar, header, and footer components into admin pages
 * Handles collapse/expand functionality and active page detection
 */

// Page configuration - maps page identifiers to titles and icons
const PAGE_CONFIG = {
    'dashboard': { title: 'Dashboard Overview', icon: 'fa-home' },
    'it-candidates': { title: 'IT Candidates Management', icon: 'fa-laptop-code' },
    'teachers': { title: 'Teachers Management', icon: 'fa-chalkboard-teacher' },
    'pending-teachers': { title: 'Pending Teachers', icon: 'fa-user-clock' },
    'employers': { title: 'Employers Management', icon: 'fa-building' },
    'k12-leads': { title: 'K12 Leads Management', icon: 'fa-graduation-cap' },
    'job-postings': { title: 'Job Postings Management', icon: 'fa-briefcase' },
    'teacher-plans': { title: 'Teacher Plans', icon: 'fa-cubes' },
    'teacher-credits': { title: 'Teacher Credit Packs', icon: 'fa-coins' },
    'it-plans': { title: 'IT Vendor Plans', icon: 'fa-server' },
    'subscriptions': { title: 'Plan Subscriptions', icon: 'fa-clipboard-check' },
    'payments': { title: 'Payments Management', icon: 'fa-credit-card' },
    'settings': { title: 'Account Settings', icon: 'fa-cog' }
};

// Current page identifier (set by each page)
let currentPage = 'dashboard';

/**
 * Load a component HTML file into a container
 */
async function loadComponent(componentPath, containerId) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

/**
 * Initialize all admin components
 */
async function initAdminComponents() {
    // Load sidebar
    await loadComponent('components/admin-sidebar.html', 'sidebarContainer');
    
    // Load header
    await loadComponent('components/admin-header.html', 'headerContainer');
    
    // Load footer
    await loadComponent('components/admin-footer.html', 'footerContainer');
    
    // Set active page
    setActivePage();
    
    // Set page title
    updatePageTitle();
    
    // Restore sidebar state
    restoreSidebarState();
}

/**
 * Set active menu item based on current page
 */
function setActivePage() {
    const menuLinks = document.querySelectorAll('.sidebar-menu a');
    menuLinks.forEach(link => {
        const pageName = link.getAttribute('data-page');
        if (pageName === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Update page title in header
 */
function updatePageTitle() {
    const config = PAGE_CONFIG[currentPage];
    if (config) {
        const titleElement = document.getElementById('pageTitle');
        if (titleElement) {
            titleElement.innerHTML = `<i class="fas ${config.icon}"></i> ${config.title}`;
        }
        // Also update document title
        document.title = `${config.title} - TechSkillio Admin`;
    }
}

/**
 * Toggle sidebar collapse/expand
 */
function toggleSidebarCollapse() {
    const sidebar = document.getElementById('adminSidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    const toggleIcon = toggleBtn.querySelector('i');
    
    sidebar.classList.toggle('collapsed');
    
    // Update toggle button icon
    if (sidebar.classList.contains('collapsed')) {
        toggleIcon.className = 'fas fa-chevron-right';
        toggleBtn.title = 'Expand Sidebar';
        localStorage.setItem('sidebarCollapsed', 'true');
    } else {
        toggleIcon.className = 'fas fa-chevron-left';
        toggleBtn.title = 'Collapse Sidebar';
        localStorage.setItem('sidebarCollapsed', 'false');
    }
}

/**
 * Restore sidebar state from localStorage
 */
function restoreSidebarState() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        const sidebar = document.getElementById('adminSidebar');
        const toggleBtn = document.getElementById('sidebarToggle');
        const toggleIcon = toggleBtn.querySelector('i');
        
        sidebar.classList.add('collapsed');
        toggleIcon.className = 'fas fa-chevron-right';
        toggleBtn.title = 'Expand Sidebar';
    }
}

/**
 * Toggle mobile sidebar
 */
function toggleMobileSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar) sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', initAdminComponents);
