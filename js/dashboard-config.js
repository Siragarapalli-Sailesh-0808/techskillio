// Dashboard Configuration for Different User Types
// This file manages the dynamic content, API endpoints, and labels for the unified dashboard

const dashboardConfig = {
    'it-candidate': {
        labels: {
            userRole: 'IT Professional',
            skills: 'Tech Stack',
            welcomeTitle: 'Dashboard Overview',
            welcomeSubtitle: 'Explore opportunities matching your skill set.',
            statusBadge: 'Profile Verified',
            mainSection: 'Recommended Jobs'
        },
        apiEndpoints: {
            main: '/api/it-jobs',
            applications: '/api/it-applications',
            profile: '/api/it-profile'
        },
        viewAllLink: 'it-jobs.html',
        stats: [
            { icon: 'fas fa-paper-plane', value: '8', label: 'Active Applications' },
            { icon: 'fas fa-code', value: '2', label: 'Code Tests Passed' },
            { icon: 'fas fa-bookmark', value: '4', label: 'Saved Jobs' }
        ],
        sampleSkills: [
            { name: 'React.js', level: 90 },
            { name: 'Node.js', level: 75 },
            { name: 'Python', level: 85 }
        ]
    },

    'teacher-candidate': {
        labels: {
            userRole: 'Teaching Professional',
            skills: 'Qualifications',
            welcomeTitle: 'Welcome Back!',
            welcomeSubtitle: 'Track your applications and find your dream teaching role.',
            statusBadge: 'Profile Complete',
            mainSection: 'Recommended Positions'
        },
        apiEndpoints: {
            main: '/api/teacher-jobs',
            applications: '/api/teacher-applications',
            profile: '/api/teacher-profile'
        },
        viewAllLink: 'teacher-jobs.html',
        stats: [
            { icon: 'fas fa-paper-plane', value: '12', label: 'Applications Sent' },
            { icon: 'fas fa-eye', value: '5', label: 'Profile Views' },
            { icon: 'fas fa-handshake', value: '2', label: 'Interviews' }
        ],
        sampleSkills: [
            { name: 'Mathematics', level: 95 },
            { name: 'Classroom Management', level: 88 },
            { name: 'Curriculum Design', level: 82 }
        ]
    },

    'teacher-nonteaching': {
        labels: {
            userRole: 'Administrative Professional',
            skills: 'Qualifications',
            welcomeTitle: 'Welcome Back!',
            welcomeSubtitle: 'Track your applications and find your dream administrative role.',
            statusBadge: 'Profile Complete',
            mainSection: 'Recommended Positions'
        },
        apiEndpoints: {
            main: '/api/nonteaching-jobs',
            applications: '/api/nonteaching-applications',
            profile: '/api/nonteaching-profile'
        },
        viewAllLink: 'teacher-jobs.html',
        stats: [
            { icon: 'fas fa-paper-plane', value: '8', label: 'Applications Sent' },
            { icon: 'fas fa-eye', value: '3', label: 'Profile Views' },
            { icon: 'fas fa-handshake', value: '1', label: 'Interviews' }
        ],
        sampleSkills: [
            { name: 'Administration', level: 90 },
            { name: 'Communication', level: 85 },
            { name: 'Organization', level: 92 }
        ]
    },

    'teacher-employer': {
        labels: {
            userRole: 'School Administrator',
            skills: 'Institution Details',
            welcomeTitle: 'Employer Dashboard',
            welcomeSubtitle: 'Manage your teaching positions and applications.',
            statusBadge: 'Active Subscription',
            mainSection: 'Posted Positions'
        },
        apiEndpoints: {
            main: '/api/job-postings',
            candidates: '/api/candidates',
            profile: '/api/employer-profile'
        },
        viewAllLink: 'teacher-jobs.html',
        stats: [
            { icon: 'fas fa-briefcase', value: '3', label: 'Positions Posted' },
            { icon: 'fas fa-users', value: '15', label: 'Applications Received' },
            { icon: 'fas fa-check-circle', value: 'Active', label: 'Subscription' }
        ],
        sampleSkills: [
            { name: 'School Type', level: 100, display: 'CBSE Board' },
            { name: 'Location', level: 100, display: 'Hyderabad' },
            { name: 'Established', level: 100, display: '2005' }
        ]
    },

    'it-vendor': {
        labels: {
            userRole: 'IT Vendor',
            skills: 'Company Profile',
            welcomeTitle: 'Vendor Dashboard',
            welcomeSubtitle: 'Manage your job postings and candidate applications.',
            statusBadge: 'Active Plan',
            mainSection: 'Posted Jobs'
        },
        apiEndpoints: {
            main: '/api/vendor-postings',
            candidates: '/api/it-candidates',
            profile: '/api/vendor-profile'
        },
        viewAllLink: 'it-jobs.html',
        stats: [
            { icon: 'fas fa-briefcase', value: '5', label: 'Jobs Posted' },
            { icon: 'fas fa-users', value: '28', label: 'Applications' },
            { icon: 'fas fa-crown', value: 'Premium', label: 'Plan Status' }
        ],
        sampleSkills: [
            { name: 'Company Size', level: 100, display: '50-200 employees' },
            { name: 'Industry', level: 100, display: 'IT Services' },
            { name: 'Since', level: 100, display: '2010' }
        ]
    }
};

// Add aliases for backend user types (underscores)
dashboardConfig['it_candidate'] = dashboardConfig['it-candidate'];
dashboardConfig['teacher_candidate'] = dashboardConfig['teacher-candidate'];
dashboardConfig['teacher_employer'] = dashboardConfig['teacher-employer'];
dashboardConfig['teacher_nonteaching'] = dashboardConfig['teacher-nonteaching'];
dashboardConfig['it_vendor'] = dashboardConfig['it-vendor'];
dashboardConfig['school_employer'] = dashboardConfig['teacher-employer']; // Legacy support

// Helper function to get user type from storage
function getUserType() {
    return localStorage.getItem('userType') || sessionStorage.getItem('userType') || 'it-candidate';
}

// Helper function to get configuration for current user
function getCurrentConfig() {
    const userType = getUserType();
    return dashboardConfig[userType] || dashboardConfig['it-candidate'];
}
