// Profile Configuration for Different User Types
// Defines which fields to show for each user type in the profile page

const profileConfig = {
    'it-candidate': {
        role: 'IT Professional',
        professionalTitle: 'Professional Information',
        skillsTitle: 'Skills & Expertise',
        showPhoto: false,
        
        personalFields: [
            { key: 'fullName', label: 'Full Name', type: 'text', required: true },
            { key: 'email', label: 'Email', type: 'email', required: true },
            { key: 'contact', label: 'Phone Number', type: 'tel', required: true },
            { key: 'currentLocation', label: 'Current Location', type: 'text', required: true },
            { key: 'qualification', label: 'Highest Qualification', type: 'text', required: true },
            { key: 'educationStatus', label: 'Education Status', type: 'select', required: true, options: ['Completed', 'Pursuing'] }
        ],
        
        professionalFields: [
            { key: 'currentRole', label: 'Current Role', type: 'text', required: true },
            { key: 'desiredJobRole', label: 'Desired Job Role', type: 'text' },
            { key: 'yearsOfExperience', label: 'Years of Experience', type: 'number', required: true },
            { key: 'currentCTC', label: 'Current CTC (₹)', type: 'text' },
            { key: 'expectedCTC', label: 'Expected CTC (₹)', type: 'text', required: true },
            { key: 'preferredModeOfWork', label: 'Preferred Mode', type: 'select', required: true, options: ['Remote', 'Onsite', 'Hybrid'] },
            { key: 'employmentType', label: 'Employment Type', type: 'select', required: true, options: ['Full-time', 'Part-time', 'Contract'] },
            { key: 'availabilityOrNoticePeriod', label: 'Notice Period', type: 'text', required: true }
        ]
    },

    'it-vendor': {
        role: 'IT Vendor',
        professionalTitle: 'Company Information',
        skillsTitle: 'Roles Looking For',
        showPhoto: false,
        
        personalFields: [
            { key: 'companyName', label: 'Company Name', type: 'text', required: true },
            { key: 'companyEmail', label: 'Company Email', type: 'email', required: true },
            { key: 'companyContact', label: 'Contact Number', type: 'tel', required: true },
            { key: 'companyLocation', label: 'Company Location', type: 'text', required: true },
            { key: 'companyUrl', label: 'Website', type: 'url' },
            { key: 'linkedInUrl', label: 'LinkedIn Profile', type: 'url' }
        ],
        
        professionalFields: [
            { key: 'sizeOfCompany', label: 'Company Size', type: 'select', required: true, options: ['1-10', '11-50', '51-200', '201-500', '500+'] },
            { key: 'companyType', label: 'Company Type', type: 'select', required: true, options: ['Recruitment', 'Consulting', 'Product', 'Service'] },
            { key: 'subType', label: 'Sub Category', type: 'text' },
            { key: 'requiredExperience', label: 'Required Experience', type: 'text', required: true },
            { key: 'packageOffered', label: 'Package Offered', type: 'text', required: true }
        ]
    },

    'teacher-candidate': {
        role: 'Teaching Professional',
        professionalTitle: 'Teaching Information',
        skillsTitle: 'Subjects & Expertise',
        showPhoto: true,
        
        personalFields: [
            { key: 'fullName', label: 'Full Name', type: 'text', required: true },
            { key: 'email', label: 'Email', type: 'email', required: true },
            { key: 'phone', label: 'Phone Number', type: 'tel', required: true },
            { key: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Other'] },
            { key: 'currentLocation', label: 'Current Location', type: 'text', required: true },
            { key: 'nativePlace', label: 'Native Place', type: 'text', required: true },
            { key: 'relocationPreference', label: 'Willing to Relocate', type: 'select', required: true, options: ['Yes', 'No', 'Maybe'] }
        ],
        
        professionalFields: [
            { key: 'currentProfile', label: 'Current Designation', type: 'text', required: true },
            { key: 'currentProfileExperience', label: 'Experience in Current Role (years)', type: 'number', required: true },
            { key: 'applyingForProfile', label: 'Applying For', type: 'text', required: true },
            { key: 'totalExperience', label: 'Total Experience (years)', type: 'number', required: true },
            { key: 'qualification', label: 'Highest Qualification', type: 'text', required: true },
            { key: 'teachingStyle', label: 'Teaching Methodology', type: 'textarea', fullWidth: true },
            { key: 'canTeachInEnglish', label: 'Can Teach in English', type: 'select', required: true, options: ['Yes', 'No'] },
            { key: 'currentSalary', label: 'Current Salary (₹)', type: 'text', required: true },
            { key: 'expectedSalary', label: 'Expected Salary (₹)', type: 'text', required: true },
            { key: 'whenCanJoin', label: 'When Can Join', type: 'text', required: true },
            { key: 'availableForInterview', label: 'Available for Interview', type: 'select', required: true, options: ['Yes', 'No'] },
            { key: 'interviewSlotFrom', label: 'Interview Slot From', type: 'time' },
            { key: 'interviewSlotTo', label: 'Interview Slot To', type: 'time' },
            { key: 'youtubeLink', label: 'Demo Video Link', type: 'url', fullWidth: true }
        ]
    },

    'teacher-nonteaching': {
        role: 'Administrative Professional',
        professionalTitle: 'Professional Information',
        skillsTitle: 'Skills & Expertise',
        showPhoto: true,
        
        personalFields: [
            { key: 'fullName', label: 'Full Name', type: 'text', required: true },
            { key: 'email', label: 'Email', type: 'email', required: true },
            { key: 'phone', label: 'Phone Number', type: 'tel', required: true },
            { key: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Other'] },
            { key: 'currentLocation', label: 'Current Location', type: 'text', required: true },
            { key: 'nativePlace', label: 'Native Place', type: 'text', required: true },
            { key: 'relocationPreference', label: 'Willing to Relocate', type: 'select', required: true, options: ['Yes', 'No', 'Maybe'] }
        ],
        
        professionalFields: [
            { key: 'nonTeachingRole', label: 'Role', type: 'text', required: true },
            { key: 'currentProfile', label: 'Current Designation', type: 'text', required: true },
            { key: 'currentProfileExperience', label: 'Experience in Current Role (years)', type: 'number', required: true },
            { key: 'totalExperience', label: 'Total Experience (years)', type: 'number', required: true },
            { key: 'qualification', label: 'Highest Qualification', type: 'text', required: true },
            { key: 'currentSalary', label: 'Current Salary (₹)', type: 'text', required: true },
            { key: 'expectedSalary', label: 'Expected Salary (₹)', type: 'text', required: true },
            { key: 'whenCanJoin', label: 'When Can Join', type: 'text', required: true },
            { key: 'availableForInterview', label: 'Available for Interview', type: 'select', required: true, options: ['Yes', 'No'] }
        ]
    },

    'school-employer': {
        role: 'School Administrator',
        professionalTitle: 'Institute Information',
        skillsTitle: 'Job Postings',
        showPhoto: true,
        
        personalFields: [
            { key: 'instituteName', label: 'Institute Name', type: 'text', required: true },
            { key: 'email', label: 'Email', type: 'email', required: true },
            { key: 'contactNo', label: 'Contact Number', type: 'tel', required: true },
            { key: 'city', label: 'City', type: 'text', required: true },
            { key: 'websiteLink', label: 'Website', type: 'url' }
        ],
        
        professionalFields: [
            { key: 'instituteType', label: 'Institute Type', type: 'select', required: true, options: ['School', 'College', 'Coaching', 'University'] },
            { key: 'affiliation', label: 'Board/Affiliation', type: 'text', required: true }
        ]
    }
};
