// Sample IT Jobs Data
// This file contains sample job listings for the IT Staffing module

function getAllITJobs() {
    return [
        {
            id: 1,
            title: 'Full Stack Developer',
            company: 'TechCorp Solutions',
            location: 'Bangalore',
            experience: '2-5 years',
            salary: '₹8-15 LPA',
            type: 'Full-time',
            mode: 'Hybrid',
            skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
            posted: '2 days ago',
            description: 'We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.',
            requirements: [
                'Strong proficiency in JavaScript, React, and Node.js',
                'Experience with MongoDB and RESTful APIs',
                'Knowledge of AWS services',
                'Good understanding of Git and version control',
                'Excellent problem-solving skills'
            ],
            responsibilities: [
                'Develop and maintain web applications',
                'Write clean, maintainable code',
                'Collaborate with cross-functional teams',
                'Participate in code reviews',
                'Troubleshoot and debug applications'
            ]
        },
        {
            id: 2,
            title: 'Data Scientist',
            company: 'Analytics Pro',
            location: 'Mumbai',
            experience: '3-7 years',
            salary: '₹12-20 LPA',
            type: 'Full-time',
            mode: 'On-site',
            skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
            posted: '1 week ago',
            description: 'Join our data science team to build predictive models and derive insights from large datasets.',
            requirements: [
                'Strong background in statistics and mathematics',
                'Proficiency in Python and ML libraries',
                'Experience with TensorFlow or PyTorch',
                'SQL and database knowledge',
                'Excellent analytical skills'
            ],
            responsibilities: [
                'Build and deploy machine learning models',
                'Analyze large datasets',
                'Create data visualizations',
                'Collaborate with business teams',
                'Present findings to stakeholders'
            ]
        },
        {
            id: 3,
            title: 'Frontend Developer',
            company: 'DesignHub',
            location: 'Pune',
            experience: '1-3 years',
            salary: '₹5-10 LPA',
            type: 'Full-time',
            mode: 'Remote',
            skills: ['React', 'JavaScript', 'CSS', 'HTML'],
            posted: '3 days ago',
            description: 'We need a talented Frontend Developer to create beautiful and responsive user interfaces.',
            requirements: [
                'Strong proficiency in React and JavaScript',
                'Experience with HTML5 and CSS3',
                'Knowledge of responsive design',
                'Familiarity with Git',
                'Good eye for design'
            ],
            responsibilities: [
                'Develop user-facing features',
                'Ensure UI/UX quality',
                'Optimize applications for speed',
                'Collaborate with designers',
                'Maintain code quality'
            ]
        },
        {
            id: 4,
            title: 'DevOps Engineer',
            company: 'CloudTech',
            location: 'Hyderabad',
            experience: '3-6 years',
            salary: '₹10-18 LPA',
            type: 'Full-time',
            mode: 'Hybrid',
            skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
            posted: '5 days ago',
            description: 'Looking for a DevOps Engineer to manage our cloud infrastructure and deployment pipelines.',
            requirements: [
                'Experience with AWS services',
                'Proficiency in Docker and Kubernetes',
                'Knowledge of CI/CD tools (Jenkins, GitLab CI)',
                'Scripting skills (Python, Bash)',
                'Understanding of networking and security'
            ],
            responsibilities: [
                'Manage cloud infrastructure',
                'Implement CI/CD pipelines',
                'Monitor system performance',
                'Automate deployment processes',
                'Ensure system security'
            ]
        },
        {
            id: 5,
            title: 'Mobile App Developer',
            company: 'AppWorks',
            location: 'Delhi',
            experience: '2-4 years',
            salary: '₹7-12 LPA',
            type: 'Full-time',
            mode: 'On-site',
            skills: ['React Native', 'JavaScript', 'iOS', 'Android'],
            posted: '1 day ago',
            description: 'Join our mobile team to build cross-platform applications using React Native.',
            requirements: [
                'Strong experience with React Native',
                'Knowledge of iOS and Android platforms',
                'Understanding of mobile app architecture',
                'Experience with REST APIs',
                'Good problem-solving skills'
            ],
            responsibilities: [
                'Develop mobile applications',
                'Implement new features',
                'Fix bugs and optimize performance',
                'Collaborate with backend team',
                'Publish apps to stores'
            ]
        },
        {
            id: 6,
            title: 'Backend Developer',
            company: 'ServerSide Inc',
            location: 'Chennai',
            experience: '2-5 years',
            salary: '₹8-14 LPA',
            type: 'Full-time',
            mode: 'Remote',
            skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
            posted: '4 days ago',
            description: 'We are seeking a Backend Developer to build scalable server-side applications.',
            requirements: [
                'Strong proficiency in Node.js and Express',
                'Experience with PostgreSQL or MySQL',
                'Knowledge of Redis and caching',
                'Understanding of RESTful APIs',
                'Good coding practices'
            ],
            responsibilities: [
                'Design and implement APIs',
                'Optimize database queries',
                'Implement caching strategies',
                'Write unit tests',
                'Maintain documentation'
            ]
        },
        {
            id: 7,
            title: 'UI/UX Designer',
            company: 'Creative Studio',
            location: 'Bangalore',
            experience: '1-4 years',
            salary: '₹6-11 LPA',
            type: 'Full-time',
            mode: 'Hybrid',
            skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
            posted: '1 week ago',
            description: 'Looking for a creative UI/UX Designer to craft amazing user experiences.',
            requirements: [
                'Proficiency in Figma and Adobe XD',
                'Strong portfolio of design projects',
                'Understanding of user-centered design',
                'Knowledge of design systems',
                'Good communication skills'
            ],
            responsibilities: [
                'Create wireframes and prototypes',
                'Design user interfaces',
                'Conduct user research',
                'Collaborate with developers',
                'Maintain design consistency'
            ]
        },
        {
            id: 8,
            title: 'QA Engineer',
            company: 'TestPro',
            location: 'Pune',
            experience: '2-5 years',
            salary: '₹6-10 LPA',
            type: 'Full-time',
            mode: 'On-site',
            skills: ['Selenium', 'Java', 'API Testing', 'Automation'],
            posted: '6 days ago',
            description: 'Join our QA team to ensure the quality of our software products.',
            requirements: [
                'Experience with Selenium and automation',
                'Knowledge of Java or Python',
                'Understanding of API testing',
                'Familiarity with Agile methodologies',
                'Attention to detail'
            ],
            responsibilities: [
                'Write and execute test cases',
                'Automate testing processes',
                'Report and track bugs',
                'Perform regression testing',
                'Collaborate with development team'
            ]
        }
    ];
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getAllITJobs };
}
