// Admin UI Helper Functions (Mock Data for now - API integration later)

// Mock data storage
const mockData = {
    itCandidates: [],
    teachers: [],
    employers: [],
    k12Leads: [],
    jobPostings: []
};

// Initialize with some sample data
function initializeMockData() {
    // Sample IT Candidates
    mockData.itCandidates = [
        { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Full Stack Developer', experience: '3 years', location: 'Hyderabad', expectedCTC: '₹8 LPA', status: 'Active' },
        { id: 2, name: 'Priya Patel', email: 'priya@example.com', role: 'Data Scientist', experience: '5 years', location: 'Bangalore', expectedCTC: '₹15 LPA', status: 'Active' }
    ];

    // Sample Teachers
    mockData.teachers = [
        { id: 1, name: 'Dr. Anjali Verma', email: 'anjali@example.com', subject: 'Mathematics', experience: '10 years', qualification: 'PhD', location: 'Mumbai', status: 'Active' },
        { id: 2, name: 'Suresh Kumar', email: 'suresh@example.com', subject: 'Physics', experience: '7 years', qualification: 'M.Sc', location: 'Delhi', status: 'Active' }
    ];

    // Sample Employers
    mockData.employers = [
        { id: 1, name: 'TCS', contactPerson: 'Amit Singh', email: 'amit@tcs.com', phone: '9876543210', location: 'Hyderabad', type: 'IT Company', status: 'Active' },
        { id: 2, name: 'Delhi Public School', contactPerson: 'Meera Reddy', email: 'meera@dps.com', phone: '9876543211', location: 'Delhi', type: 'School', status: 'Active' }
    ];

    // Sample K12 Leads
    mockData.k12Leads = [
        { id: 1, name: 'Aarav Mehta', email: 'aarav@example.com', phone: '9876543212', institution: 'Delhi Public School', board: 'CBSE', subject: 'Mathematics', createdAt: '2026-01-15' },
        { id: 2, name: 'Diya Sharma', email: 'diya@example.com', phone: '9876543213', institution: 'Narayana Junior College', board: 'ICSE', subject: 'Science', createdAt: '2026-01-20' }
    ];

    // Sample Job Postings
    mockData.jobPostings = [
        { id: 1, title: 'Senior Full Stack Developer', company: 'TechCorp', location: 'Hyderabad', experience: '5-8 years', salary: '₹15-20 LPA', type: 'Full-time', status: 'Active', postedDate: '2026-01-10' },
        { id: 2, title: 'Data Analyst', company: 'DataSoft', location: 'Bangalore', experience: '2-4 years', salary: '₹8-12 LPA', type: 'Full-time', status: 'Active', postedDate: '2026-01-18' }
    ];
}

// Call initialization
initializeMockData();

// Generic CRUD Operations (will be replaced with API calls later)
class AdminDataManager {
    constructor(dataType) {
        this.dataType = dataType;
    }

    getAll() {
        return [...mockData[this.dataType]];
    }

    getById(id) {
        return mockData[this.dataType].find(item => item.id === id);
    }

    create(data) {
        const newId = Math.max(...mockData[this.dataType].map(item => item.id), 0) + 1;
        const newItem = { id: newId, ...data };
        mockData[this.dataType].push(newItem);
        return newItem;
    }

    update(id, data) {
        const index = mockData[this.dataType].findIndex(item => item.id === id);
        if (index !== -1) {
            mockData[this.dataType][index] = { ...mockData[this.dataType][index], ...data };
            return mockData[this.dataType][index];
        }
        return null;
    }

    delete(id) {
        const index = mockData[this.dataType].findIndex(item => item.id === id);
        if (index !== -1) {
            mockData[this.dataType].splice(index, 1);
            return true;
        }
        return false;
    }

    search(query) {
        const lowerQuery = query.toLowerCase();
        return mockData[this.dataType].filter(item => 
            JSON.stringify(item).toLowerCase().includes(lowerQuery)
        );
    }
}

// Data managers for each entity type
const itCandidatesManager = new AdminDataManager('itCandidates');
const teachersManager = new AdminDataManager('teachers');
const employersManager = new AdminDataManager('employers');
const k12LeadsManager = new AdminDataManager('k12Leads');
const jobPostingsManager = new AdminDataManager('jobPostings');

// UI Helper Functions
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showToast(message, type = 'success') {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 140px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Mobile sidebar toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// Initialize mobile menu
function initMobileMenu() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.onclick = toggleSidebar;
    document.body.appendChild(overlay);

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'mobile-menu-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    toggleBtn.onclick = toggleSidebar;
    document.body.appendChild(toggleBtn);
}

// Pagination helper
function paginate(data, page = 1, perPage = 10) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
        data: data.slice(start, end),
        currentPage: page,
        totalPages: Math.ceil(data.length / perPage),
        totalItems: data.length
    };
}

// Render pagination controls
function renderPagination(containerId, currentPage, totalPages, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '<div class="pagination">';
    
    // Previous button
    html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="${onPageChange}(${currentPage - 1})">
        <i class="fas fa-chevron-left"></i> Previous
    </button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="${onPageChange}(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<span>...</span>';
        }
    }
    
    // Next button
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="${onPageChange}(${currentPage + 1})">
        Next <i class="fas fa-chevron-right"></i>
    </button>`;
    
    html += '</div>';
    container.innerHTML = html;
}

// Export to CSV
function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
        showToast('No data to export', 'error');
        return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('Data exported successfully!', 'success');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
