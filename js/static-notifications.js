// Static Notifications Data
// This file contains sample notification data for testing

function getStaticNotifications() {
    const userType = localStorage.getItem('userType') || 'it-candidate';
    
    if (userType === 'it-candidate' || userType === 'it-vendor') {
        return itNotifications;
    } else if (userType === 'school-employer') {
        return employerNotifications;
    } else {
        return teacherNotifications;
    }
}

// IT Candidate Notifications
const itNotifications = [
    {
        id: 'notif001',
        type: 'application_status',
        title: 'Application Shortlisted',
        message: 'Your application for Senior Frontend Developer at Google India has been shortlisted for interview',
        icon: 'fa-check-circle',
        color: '#86c540',
        isRead: false,
        createdAt: '2025-01-25T09:00:00Z',
        data: {
            applicationId: 'app001',
            jobId: 'job123'
        }
    },
    {
        id: 'notif002',
        type: 'application_status',
        title: 'Application Under Review',
        message: 'Your application for Backend Engineer at Amazon is now under review',
        icon: 'fa-clock',
        color: '#f59e0b',
        isRead: false,
        createdAt: '2025-01-23T10:00:00Z',
        data: {
            applicationId: 'app002',
            jobId: 'job456'
        }
    },
    {
        id: 'notif003',
        type: 'new_job_match',
        title: 'New Job Match',
        message: 'A new job matching your profile: Cloud Architect at AWS India (92% match)',
        icon: 'fa-briefcase',
        color: '#3b82f6',
        isRead: true,
        createdAt: '2025-01-22T14:30:00Z',
        data: {
            jobId: 'job999',
            matchScore: 92
        }
    },
    {
        id: 'notif004',
        type: 'application_status',
        title: 'Application Received',
        message: 'Your application for Full Stack Developer at Microsoft has been received',
        icon: 'fa-paper-plane',
        color: '#3b82f6',
        isRead: true,
        createdAt: '2025-01-24T11:20:00Z',
        data: {
            applicationId: 'app003',
            jobId: 'job789'
        }
    },
    {
        id: 'notif005',
        type: 'application_status',
        title: 'Application Not Selected',
        message: 'Unfortunately, your application for React Developer at Flipkart was not selected',
        icon: 'fa-times-circle',
        color: '#ef4444',
        isRead: true,
        createdAt: '2025-01-23T16:00:00Z',
        data: {
            applicationId: 'app004',
            jobId: 'job234'
        }
    },
    {
        id: 'notif006',
        type: 'profile_view',
        title: 'Profile Viewed',
        message: 'Your profile was viewed by 3 companies this week',
        icon: 'fa-eye',
        color: '#8b5cf6',
        isRead: true,
        createdAt: '2025-01-21T09:00:00Z',
        data: {
            viewCount: 3
        }
    },
    {
        id: 'notif007',
        type: 'offer',
        title: 'Offer Received!',
        message: 'Congratulations! You have received an offer for UI/UX Developer at Paytm',
        icon: 'fa-trophy',
        color: '#10b981',
        isRead: false,
        createdAt: '2025-01-24T11:00:00Z',
        data: {
            applicationId: 'app007',
            jobId: 'job345'
        }
    },
    {
        id: 'notif008',
        type: 'reminder',
        title: 'Complete Your Profile',
        message: 'Your profile is 85% complete. Add your certifications to increase visibility',
        icon: 'fa-user-edit',
        color: '#f59e0b',
        isRead: true,
        createdAt: '2025-01-20T10:00:00Z',
        data: {
            completeness: 85
        }
    }
];

// Teacher Candidate Notifications
const teacherNotifications = [
    {
        id: 'notif101',
        type: 'application_status',
        title: 'Shortlisted for Interview',
        message: 'Your application for Mathematics Teacher at Delhi Public School has been shortlisted',
        icon: 'fa-check-circle',
        color: '#86c540',
        isRead: false,
        createdAt: '2025-01-24T10:00:00Z',
        data: {
            applicationId: 'app101',
            positionId: 'pos123'
        }
    },
    {
        id: 'notif102',
        type: 'application_status',
        title: 'Profile Under Review',
        message: 'Your application for Biology Teacher at Oakridge International is being reviewed',
        icon: 'fa-clock',
        color: '#f59e0b',
        isRead: false,
        createdAt: '2025-01-25T09:00:00Z',
        data: {
            applicationId: 'app102',
            positionId: 'pos456'
        }
    },
    {
        id: 'notif103',
        type: 'new_position_match',
        title: 'New Position Match',
        message: 'New position: Senior Mathematics Teacher at Amity School (88% match)',
        icon: 'fa-school',
        color: '#3b82f6',
        isRead: true,
        createdAt: '2025-01-23T14:00:00Z',
        data: {
            positionId: 'pos888',
            matchScore: 88
        }
    },
    {
        id: 'notif104',
        type: 'offer',
        title: 'Offer Letter Received!',
        message: 'Congratulations! Offer letter for Chemistry Teacher at Amity International School',
        icon: 'fa-trophy',
        color: '#10b981',
        isRead: false,
        createdAt: '2025-01-25T10:00:00Z',
        data: {
            applicationId: 'app106',
            positionId: 'pos890'
        }
    },
    {
        id: 'notif105',
        type: 'application_status',
        title: 'Application Not Selected',
        message: 'Your application for English Teacher at Ryan International was not selected',
        icon: 'fa-times-circle',
        color: '#ef4444',
        isRead: true,
        createdAt: '2025-01-23T15:00:00Z',
        data: {
            applicationId: 'app103',
            positionId: 'pos789'
        }
    }
];

// Employer Notifications
const employerNotifications = [
    {
        id: 'notif201',
        type: 'new_application',
        title: 'New Application Received',
        message: 'Rajesh Kumar applied for Mathematics Teacher position',
        icon: 'fa-user-plus',
        color: '#3b82f6',
        isRead: false,
        createdAt: '2025-01-26T14:00:00Z',
        data: {
            applicationId: 'app321',
            candidateId: 'user789',
            positionId: 'post123'
        }
    },
    {
        id: 'notif202',
        type: 'new_application',
        title: 'New Application Received',
        message: 'Priya Sharma applied for English Teacher position',
        icon: 'fa-user-plus',
        color: '#3b82f6',
        isRead: false,
        createdAt: '2025-01-26T11:30:00Z',
        data: {
            applicationId: 'app322',
            candidateId: 'user790',
            positionId: 'post124'
        }
    },
    {
        id: 'notif203',
        type: 'subscription',
        title: 'Subscription Expiring Soon',
        message: 'Your premium subscription will expire in 7 days. Renew now to continue posting',
        icon: 'fa-exclamation-triangle',
        color: '#f59e0b',
        isRead: true,
        createdAt: '2025-01-25T09:00:00Z',
        data: {
            daysRemaining: 7
        }
    },
    {
        id: 'notif204',
        type: 'job_posting',
        title: 'Job Posting Expiring',
        message: 'Your job posting for Science Teacher will expire in 3 days',
        icon: 'fa-clock',
        color: '#f59e0b',
        isRead: true,
        createdAt: '2025-01-24T10:00:00Z',
        data: {
            postingId: 'post125',
            daysRemaining: 3
        }
    },
    {
        id: 'notif205',
        type: 'credits',
        title: 'Low Credits Alert',
        message: 'You have only 15 credits remaining. Purchase more to continue viewing profiles',
        icon: 'fa-coins',
        color: '#ef4444',
        isRead: false,
        createdAt: '2025-01-23T16:00:00Z',
        data: {
            creditsRemaining: 15
        }
    }
];
