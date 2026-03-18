// Static Applications Data
// This file contains sample application data for testing the My Applications page

function getStaticApplications() {
    const userType = localStorage.getItem('userType') || 'it-candidate';
    
    if (userType === 'it-candidate' || userType === 'it-vendor') {
        return itApplications;
    } else {
        return teacherApplications;
    }
}

// IT Candidate Applications
const itApplications = [
    {
        id: 'app001',
        jobId: 'job123',
        jobTitle: 'Senior Frontend Developer',
        company: 'Google India',
        location: 'Bangalore',
        salary: '₹24L - ₹35L',
        appliedDate: '2025-01-20T10:00:00Z',
        status: 'shortlisted',
        timeline: [
            { title: 'Application Submitted', date: '2025-01-20T10:00:00Z', completed: true },
            { title: 'Application Under Review', date: '2025-01-21T14:30:00Z', completed: true },
            { title: 'Shortlisted for Interview', date: '2025-01-25T09:00:00Z', completed: true },
            { title: 'Technical Interview', date: null, completed: false },
            { title: 'Final Decision', date: null, completed: false }
        ]
    },
    {
        id: 'app002',
        jobId: 'job456',
        jobTitle: 'Backend Engineer',
        company: 'Amazon Development Center',
        location: 'Hyderabad',
        salary: '₹18L - ₹28L',
        appliedDate: '2025-01-22T15:45:00Z',
        status: 'under_review',
        timeline: [
            { title: 'Application Submitted', date: '2025-01-22T15:45:00Z', completed: true },
            { title: 'Application Under Review', date: '2025-01-23T10:00:00Z', completed: true },
            { title: 'Shortlisted for Interview', date: null, completed: false },
            { title: 'Technical Interview', date: null, completed: false },
            { title: 'Final Decision', date: null, completed: false }
        ]
    },
    {
        id: 'app003',
        jobId: 'job789',
        jobTitle: 'Full Stack Developer',
        company: 'Microsoft India',
        location: 'Bangalore',
        salary: '₹20L - ₹32L',
        appliedDate: '2025-01-24T11:20:00Z',
        status: 'submitted',
        timeline: [
            { title: 'Application Submitted', date: '2025-01-24T11:20:00Z', completed: true },
            { title: 'Application Under Review', date: null, completed: false },
            { title: 'Shortlisted for Interview', date: null, completed: false },
            { title: 'Technical Interview', date: null, completed: false },
            { title: 'Final Decision', date: null, completed: false }
        ]
    },
    {
        id: 'app004',
        jobId: 'job234',
        jobTitle: 'React Developer',
        company: 'Flipkart',
        location: 'Bangalore',
        salary: '₹15L - ₹22L',
        appliedDate: '2025-01-18T09:30:00Z',
        status: 'rejected',
        timeline: [
            { title: 'Application Submitted', date: '2025-01-18T09:30:00Z', completed: true },
            { title: 'Application Under Review', date: '2025-01-19T10:00:00Z', completed: true },
            { title: 'Application Not Selected', date: '2025-01-23T16:00:00Z', completed: true }
        ]
    },
    {
        id: 'app005',
        jobId: 'job567',
        jobTitle: 'DevOps Engineer',
        company: 'Swiggy',
        location: 'Bangalore',
        salary: '₹16L - ₹25L',
        appliedDate: '2025-01-25T14:00:00Z',
        status: 'submitted',
        timeline: [
            { title: 'Application Submitted', date: '2025-01-25T14:00:00Z', completed: true },
            { title: 'Application Under Review', date: null, completed: false },
            { title: 'Shortlisted for Interview', date: null, completed: false },
            { title: 'Technical Interview', date: null, completed: false },
            { title: 'Final Decision', date: null, completed: false }
        ]
    },
    {
        id: 'app006',
        jobId: 'job890',
        jobTitle: 'Python Developer',
        company: 'Zomato',
        location: 'Gurugram',
        salary: '₹12L - ₹18L',
        appliedDate: '2025-01-26T10:15:00Z',
        status: 'under_review',
        timeline: [
            { title: 'Application Submitted', date: '2025-01-26T10:15:00Z', completed: true },
            { title: 'Application Under Review', date: '2025-01-26T16:00:00Z', completed: true },
            { title: 'Shortlisted for Interview', date: null, completed: false },
            { title: 'Technical Interview', date: null, completed: false },
            { title: 'Final Decision', date: null, completed: false }
        ]
    },
    {
        id: 'app007',
        jobId: 'job345',
        jobTitle: 'UI/UX Developer',
        company: 'Paytm',
        location: 'Noida',
        salary: '₹14L - ₹20L',
        appliedDate: '2025-01-15T13:00:00Z',
        status: 'accepted',
        timeline: [
            { title: 'Application Submitted', date: '2025-01-15T13:00:00Z', completed: true },
            { title: 'Application Under Review', date: '2025-01-16T10:00:00Z', completed: true },
            { title: 'Shortlisted for Interview', date: '2025-01-18T09:00:00Z', completed: true },
            { title: 'Technical Interview Completed', date: '2025-01-22T15:00:00Z', completed: true },
            { title: 'Offer Extended', date: '2025-01-24T11:00:00Z', completed: true }
        ]
    },
    {
        id: 'app008',
        jobId: 'job678',
        jobTitle: 'Java Developer',
        company: 'TCS',
        location: 'Pune',
        salary: '₹8L - ₹12L',
        appliedDate: '2025-01-23T16:30:00Z',
        status: 'submitted',
        timeline: [
            { title: 'Application Submitted', date: '2025-01-23T16:30:00Z', completed: true },
            { title: 'Application Under Review', date: null, completed: false },
            { title: 'Shortlisted for Interview', date: null, completed: false },
            { title: 'Technical Interview', date: null, completed: false },
            { title: 'Final Decision', date: null, completed: false }
        ]
    }
];

// Teacher Candidate Applications
const teacherApplications = [
    {
        id: 'app101',
        jobId: 'pos123',
        jobTitle: 'Mathematics Senior Teacher',
        company: 'Delhi Public School',
        location: 'Delhi',
        salary: '₹45k - ₹60k / month',
        appliedDate: '2025-01-22T09:00:00Z',
        status: 'shortlisted',
        timeline: [
            { title: 'Application Submitted', date: '2025-01-22T09:00:00Z', completed: true },
            { title: 'Profile Reviewed', date: '2025-01-23T11:00:00Z', completed: true },
            { title: 'Shortlisted for Interview', date: '2025-01-24T10:00:00Z', completed: true },
            { title: 'Demo Class', date: null, completed: false },
            { title: 'Final Decision', date: null, completed: false }
        ]
    },
    {
        id: 'app102',
        jobId: 'pos456',
        jobTitle: 'Biology Teacher',
        company: 'Oakridge International School',
        location: 'Bangalore',
        salary: '₹50k - ₹70k / month',
        appliedDate: '2025-01-24T11:20:00Z',
        status: 'under_review',
        timeline: [
            { title: 'Application Submitted', date: '2025-01-24T11:20:00Z', completed: true },
            { title: 'Profile Under Review', date: '2025-01-25T09:00:00Z', completed: true },
            { title: 'Shortlisted for Interview', date: null, completed: false },
            { title: 'Demo Class', date: null, completed: false },
            { title: 'Final Decision', date: null, completed: false }
        ]
    },
    {
        id: 'app103',
        jobId: 'pos789',
        jobTitle: 'English Teacher',
        company: 'Ryan International School',
        location: 'Mumbai',
        salary: '₹40k - ₹55k / month',
        appliedDate: '2025-01-20T14:30:00Z',
        status: 'rejected',
        timeline: [
            { title: 'Application Submitted', date: '2025-01-20T14:30:00Z', completed: true },
            { title: 'Profile Reviewed', date: '2025-01-21T10:00:00Z', completed: true },
            { title: 'Application Not Selected', date: '2025-01-23T15:00:00Z', completed: true }
        ]
    },
    {
        id: 'app104',
        jobId: 'pos234',
        jobTitle: 'Science Teacher',
        company: 'Kendriya Vidyalaya',
        location: 'Hyderabad',
        salary: '₹35k - ₹50k / month',
        appliedDate: '2025-01-25T10:00:00Z',
        status: 'submitted',
        timeline: [
            { title: 'Application Submitted', date: '2025-01-25T10:00:00Z', completed: true },
            { title: 'Profile Under Review', date: null, completed: false },
            { title: 'Shortlisted for Interview', date: null, completed: false },
            { title: 'Demo Class', date: null, completed: false },
            { title: 'Final Decision', date: null, completed: false }
        ]
    },
    {
        id: 'app105',
        jobId: 'pos567',
        jobTitle: 'Physics Teacher',
        company: 'Narayana School',
        location: 'Chennai',
        salary: '₹42k - ₹58k / month',
        appliedDate: '2025-01-26T13:45:00Z',
        status: 'submitted',
        timeline: [
            { title: 'Application Submitted', date: '2025-01-26T13:45:00Z', completed: true },
            { title: 'Profile Under Review', date: null, completed: false },
            { title: 'Shortlisted for Interview', date: null, completed: false },
            { title: 'Demo Class', date: null, completed: false },
            { title: 'Final Decision', date: null, completed: false }
        ]
    },
    {
        id: 'app106',
        jobId: 'pos890',
        jobTitle: 'Chemistry Teacher',
        company: 'Amity International School',
        location: 'Noida',
        salary: '₹48k - ₹65k / month',
        appliedDate: '2025-01-18T09:15:00Z',
        status: 'accepted',
        timeline: [
            { title: 'Application Submitted', date: '2025-01-18T09:15:00Z', completed: true },
            { title: 'Profile Reviewed', date: '2025-01-19T10:00:00Z', completed: true },
            { title: 'Shortlisted for Interview', date: '2025-01-20T11:00:00Z', completed: true },
            { title: 'Demo Class Completed', date: '2025-01-23T14:00:00Z', completed: true },
            { title: 'Offer Letter Sent', date: '2025-01-25T10:00:00Z', completed: true }
        ]
    }
];
