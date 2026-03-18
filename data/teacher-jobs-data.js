// Dummy Teacher Jobs Data
const teacherJobsData = [
  {
    id: 1,
    title: "Mathematics Teacher (Grades 9-12)",
    school: "Delhi Public School",
    location: "Bangalore, Karnataka",
    experience: "3-5 Years",
    salary: "₹4-6 LPA",
    type: "Full-time",
    subjects: ["Mathematics", "Statistics"],
    board: "CBSE",
    qualification: "B.Ed with Mathematics specialization",
    description: "We are looking for an experienced Mathematics teacher for senior secondary classes. The ideal candidate should have strong conceptual knowledge and ability to make complex topics simple.",
    requirements: [
      "B.Ed degree with Mathematics as main subject",
      "3-5 years of teaching experience in CBSE schools",
      "Strong communication and classroom management skills",
      "Ability to use technology in teaching",
      "Experience in preparing students for board exams"
    ],
    posted: "2 days ago"
  },
  {
    id: 2,
    title: "English Teacher (Primary)",
    school: "Ryan International School",
    location: "Hyderabad, Telangana",
    experience: "2-4 Years",
    salary: "₹3.5-5 LPA",
    type: "Full-time",
    subjects: ["English", "Literature"],
    board: "ICSE",
    qualification: "B.A English + B.Ed",
    description: "Seeking a passionate English teacher for primary grades who can create an engaging learning environment and foster love for language.",
    requirements: [
      "B.A in English with B.Ed certification",
      "2-4 years of teaching experience",
      "Excellent command over English language",
      "Creative teaching methodologies",
      "Experience with ICSE curriculum"
    ],
    posted: "1 week ago"
  },
  {
    id: 3,
    title: "Science Teacher (Middle School)",
    school: "Kendriya Vidyalaya",
    location: "Pune, Maharashtra",
    experience: "4-7 Years",
    salary: "₹4.5-7 LPA",
    type: "Full-time",
    subjects: ["Physics", "Chemistry", "Biology"],
    board: "CBSE",
    qualification: "M.Sc + B.Ed",
    description: "Looking for an experienced Science teacher for middle school classes with strong practical knowledge and lab skills.",
    requirements: [
      "M.Sc in Science with B.Ed",
      "4-7 years of teaching experience",
      "Hands-on experience with lab experiments",
      "Ability to teach all three sciences",
      "CBSE curriculum expertise"
    ],
    posted: "3 days ago"
  },
  {
    id: 4,
    title: "Computer Science Teacher",
    school: "DAV Public School",
    location: "Gurgaon, Haryana",
    experience: "2-5 Years",
    salary: "₹4-6.5 LPA",
    type: "Full-time",
    subjects: ["Computer Science", "Coding", "Robotics"],
    board: "CBSE",
    qualification: "B.Tech/MCA + B.Ed",
    description: "We need a tech-savvy Computer Science teacher who can teach programming, robotics, and emerging technologies to students.",
    requirements: [
      "B.Tech/MCA with B.Ed or equivalent",
      "Knowledge of Python, Java, and web technologies",
      "Experience with robotics and AI basics",
      "2-5 years of teaching experience",
      "Ability to conduct coding workshops"
    ],
    posted: "5 days ago"
  },
  {
    id: 5,
    title: "Social Studies Teacher",
    school: "Narayana School",
    location: "Chennai, Tamil Nadu",
    experience: "3-6 Years",
    salary: "₹3.5-5.5 LPA",
    type: "Full-time",
    subjects: ["History", "Geography", "Civics"],
    board: "State Board",
    qualification: "M.A + B.Ed",
    description: "Experienced Social Studies teacher required for teaching History, Geography, and Civics to middle and high school students.",
    requirements: [
      "M.A in History/Geography with B.Ed",
      "3-6 years of teaching experience",
      "Strong knowledge of Indian history and geography",
      "Interactive teaching methods",
      "State board curriculum knowledge"
    ],
    posted: "1 day ago"
  },
  {
    id: 6,
    title: "Hindi Teacher",
    school: "Amity International School",
    location: "Noida, Uttar Pradesh",
    experience: "2-4 Years",
    salary: "₹3-4.5 LPA",
    type: "Full-time",
    subjects: ["Hindi", "Sanskrit"],
    board: "CBSE",
    qualification: "M.A Hindi + B.Ed",
    description: "Looking for a Hindi teacher with excellent command over the language and ability to teach literature effectively.",
    requirements: [
      "M.A in Hindi with B.Ed",
      "2-4 years of teaching experience",
      "Strong grasp of Hindi literature",
      "CBSE curriculum experience",
      "Good communication skills"
    ],
    posted: "4 days ago"
  },
  {
    id: 7,
    title: "Art & Craft Teacher",
    school: "The Heritage School",
    location: "Kolkata, West Bengal",
    experience: "1-3 Years",
    salary: "₹2.5-4 LPA",
    type: "Full-time",
    subjects: ["Art", "Craft", "Drawing"],
    board: "ICSE",
    qualification: "BFA + Teaching Certificate",
    description: "Creative Art teacher needed to inspire students and develop their artistic skills through various mediums.",
    requirements: [
      "BFA or equivalent degree",
      "1-3 years of teaching experience",
      "Proficiency in various art forms",
      "Ability to organize art exhibitions",
      "Patient and creative approach"
    ],
    posted: "6 days ago"
  },
  {
    id: 8,
    title: "Physical Education Teacher",
    school: "Sanskar School",
    location: "Ahmedabad, Gujarat",
    experience: "2-5 Years",
    salary: "₹3-5 LPA",
    type: "Full-time",
    subjects: ["Physical Education", "Sports"],
    board: "CBSE",
    qualification: "B.P.Ed + Sports Certification",
    description: "Energetic PE teacher required to conduct sports activities, physical training, and promote fitness among students.",
    requirements: [
      "B.P.Ed degree with sports certification",
      "2-5 years of teaching experience",
      "Knowledge of various sports and games",
      "First aid certification preferred",
      "Ability to organize sports events"
    ],
    posted: "3 days ago"
  },
  {
    id: 9,
    title: "Music Teacher",
    school: "Vibgyor High School",
    location: "Mumbai, Maharashtra",
    experience: "2-4 Years",
    salary: "₹3.5-5 LPA",
    type: "Part-time",
    subjects: ["Music", "Vocal", "Instrumental"],
    board: "CBSE",
    qualification: "Music Degree + Teaching Experience",
    description: "Passionate music teacher needed to teach vocal and instrumental music to students of all age groups.",
    requirements: [
      "Degree in Music or equivalent",
      "2-4 years of teaching experience",
      "Proficiency in vocal and at least one instrument",
      "Ability to prepare students for competitions",
      "Patient and encouraging approach"
    ],
    posted: "1 week ago"
  },
  {
    id: 10,
    title: "Economics Teacher (Senior Secondary)",
    school: "Modern School",
    location: "Delhi NCR",
    experience: "4-8 Years",
    salary: "₹5-8 LPA",
    type: "Full-time",
    subjects: ["Economics", "Business Studies"],
    board: "CBSE",
    qualification: "M.A Economics + B.Ed",
    description: "Experienced Economics teacher for Class 11-12 with strong analytical skills and ability to explain complex economic concepts.",
    requirements: [
      "M.A in Economics with B.Ed",
      "4-8 years of teaching experience",
      "Strong knowledge of micro and macroeconomics",
      "Experience in board exam preparation",
      "Ability to relate economics to real-world scenarios"
    ],
    posted: "2 days ago"
  }
];

// Function to get all teacher jobs
function getAllTeacherJobs() {
  return teacherJobsData;
}

// Function to get teacher job by ID
function getTeacherJobById(id) {
  return teacherJobsData.find(job => job.id === parseInt(id));
}

// Function to filter teacher jobs
function filterTeacherJobs(filters) {
  return teacherJobsData.filter(job => {
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.subject && !job.subjects.some(s => s.toLowerCase().includes(filters.subject.toLowerCase()))) {
      return false;
    }
    if (filters.board && job.board !== filters.board) {
      return false;
    }
    if (filters.experience && job.experience !== filters.experience) {
      return false;
    }
    return true;
  });
}
