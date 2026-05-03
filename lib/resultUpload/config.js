// ── Result Upload Module Configuration ──
// Static configuration for filter dropdowns and grade mappings.
// Swap these for database queries later without changing the UI.

export const ACADEMIC_YEARS = [
  '2024/2025',
  '2023/2024',
  '2022/2023',
  '2021/2022',
  '2020/2021',
];

export const DEPARTMENTS = [
  { value: 'Software Engineering', label: 'Software Engineering (SE)' },
  { value: 'Computer Information Systems', label: 'Computer Information Systems (CIS)' },
  { value: 'Data Science', label: 'Data Science (DS)' },
];

export const BATCHES = [
  '24/25',
  '23/24',
  '22/23',
  '21/22',
  '20/21',
];

export const SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];

// Subjects organized by department — aligned with SUSL Faculty of Computing curriculum
export const SUBJECTS = {
  'Software Engineering': [
    // Year 1
    { code: 'SE1101', name: 'Programming Fundamentals', credits: 3, semester: 'Semester 1' },
    { code: 'SE1102', name: 'Algorithms & Logic Design', credits: 3, semester: 'Semester 1' },
    { code: 'SE1103', name: 'Mathematics for Computing', credits: 3, semester: 'Semester 1' },
    { code: 'SE1201', name: 'Statistics & Probability', credits: 3, semester: 'Semester 2' },
    { code: 'SE1202', name: 'Object-Oriented Programming', credits: 4, semester: 'Semester 2' },
    { code: 'SE1203', name: 'Discrete Mathematics', credits: 3, semester: 'Semester 2' },
    // Year 2
    { code: 'SE2101', name: 'Computer Networks', credits: 3, semester: 'Semester 3' },
    { code: 'SE2102', name: 'Database Management Systems', credits: 4, semester: 'Semester 3' },
    { code: 'SE2103', name: 'Web Systems Development', credits: 3, semester: 'Semester 3' },
    { code: 'SE2201', name: 'Human-Computer Interaction', credits: 3, semester: 'Semester 4' },
    { code: 'SE2202', name: 'Data Structures', credits: 4, semester: 'Semester 4' },
    { code: 'SE2203', name: 'Software Design Patterns', credits: 3, semester: 'Semester 4' },
    // Year 3
    { code: 'SE3101', name: 'Cybersecurity Fundamentals', credits: 3, semester: 'Semester 5' },
    { code: 'SE3102', name: 'Software Testing & QA', credits: 3, semester: 'Semester 5' },
    { code: 'SE3103', name: 'Cloud Computing', credits: 3, semester: 'Semester 5' },
    { code: 'SE3201', name: 'Software Architecture', credits: 4, semester: 'Semester 6' },
    { code: 'SE3202', name: 'Advanced Web Technologies', credits: 3, semester: 'Semester 6' },
    { code: 'SE3203', name: 'Agile & DevOps Practices', credits: 3, semester: 'Semester 6' },
    // Year 4
    { code: 'SE4101', name: 'Research Project (Part I)', credits: 6, semester: 'Semester 7' },
    { code: 'SE4102', name: 'Industrial Training', credits: 3, semester: 'Semester 7' },
    { code: 'SE4103', name: 'Machine Learning', credits: 3, semester: 'Semester 7' },
    { code: 'SE4201', name: 'Research Project (Part II)', credits: 6, semester: 'Semester 8' },
    { code: 'SE4202', name: 'Service-Oriented Architecture', credits: 3, semester: 'Semester 8' },
    { code: 'SE4203', name: 'Emerging Technologies', credits: 3, semester: 'Semester 8' },
  ],
  'Computer Information Systems': [
    // Year 1
    { code: 'CIS1101', name: 'IT Fundamentals', credits: 3, semester: 'Semester 1' },
    { code: 'CIS1102', name: 'Database Concepts', credits: 3, semester: 'Semester 1' },
    { code: 'CIS1103', name: 'Web Technologies Basics', credits: 3, semester: 'Semester 1' },
    { code: 'CIS1201', name: 'Human-Computer Interaction', credits: 3, semester: 'Semester 2' },
    { code: 'CIS1202', name: 'Business Communication', credits: 3, semester: 'Semester 2' },
    { code: 'CIS1203', name: 'Programming for IS', credits: 4, semester: 'Semester 2' },
    // Year 2
    { code: 'CIS2101', name: 'Data Structures', credits: 4, semester: 'Semester 3' },
    { code: 'CIS2102', name: 'Software Engineering Practices', credits: 3, semester: 'Semester 3' },
    { code: 'CIS2103', name: 'Agile Project Management', credits: 3, semester: 'Semester 3' },
    { code: 'CIS2201', name: 'Systems Analysis & Design', credits: 3, semester: 'Semester 4' },
    { code: 'CIS2202', name: 'Information Security', credits: 3, semester: 'Semester 4' },
    { code: 'CIS2203', name: 'E-Business Systems', credits: 3, semester: 'Semester 4' },
    // Year 3
    { code: 'CIS3101', name: 'Business Intelligence', credits: 4, semester: 'Semester 5' },
    { code: 'CIS3102', name: 'Enterprise Architecture', credits: 3, semester: 'Semester 5' },
    { code: 'CIS3103', name: 'IT Governance & Compliance', credits: 3, semester: 'Semester 5' },
    { code: 'CIS3201', name: 'Knowledge Management', credits: 3, semester: 'Semester 6' },
    { code: 'CIS3202', name: 'IT Strategy & Planning', credits: 3, semester: 'Semester 6' },
    { code: 'CIS3203', name: 'Decision Support Systems', credits: 3, semester: 'Semester 6' },
    // Year 4
    { code: 'CIS4101', name: 'Research Project (Part I)', credits: 6, semester: 'Semester 7' },
    { code: 'CIS4102', name: 'Cloud & Distributed Systems', credits: 3, semester: 'Semester 7' },
    { code: 'CIS4103', name: 'IT Law & Ethics', credits: 3, semester: 'Semester 7' },
    { code: 'CIS4201', name: 'Research Project (Part II)', credits: 6, semester: 'Semester 8' },
    { code: 'CIS4202', name: 'Digital Transformation', credits: 3, semester: 'Semester 8' },
    { code: 'CIS4203', name: 'Advanced IS Seminar', credits: 3, semester: 'Semester 8' },
  ],
  'Data Science': [
    // Year 1
    { code: 'DS1101', name: 'Introduction to Data Science', credits: 3, semester: 'Semester 1' },
    { code: 'DS1102', name: 'Statistics for Computing', credits: 3, semester: 'Semester 1' },
    { code: 'DS1103', name: 'Python Programming', credits: 4, semester: 'Semester 1' },
    { code: 'DS1201', name: 'Probability & Inference', credits: 3, semester: 'Semester 2' },
    { code: 'DS1202', name: 'Linear Algebra for DS', credits: 3, semester: 'Semester 2' },
    { code: 'DS1203', name: 'Data Wrangling & EDA', credits: 3, semester: 'Semester 2' },
    // Year 2
    { code: 'DS2101', name: 'Machine Learning Foundations', credits: 4, semester: 'Semester 3' },
    { code: 'DS2102', name: 'Database Systems for DS', credits: 3, semester: 'Semester 3' },
    { code: 'DS2103', name: 'Data Visualization', credits: 3, semester: 'Semester 3' },
    { code: 'DS2201', name: 'Advanced Machine Learning', credits: 4, semester: 'Semester 4' },
    { code: 'DS2202', name: 'Big Data Technologies', credits: 3, semester: 'Semester 4' },
    { code: 'DS2203', name: 'Time Series Analysis', credits: 3, semester: 'Semester 4' },
    // Year 3
    { code: 'DS3101', name: 'Deep Learning', credits: 4, semester: 'Semester 5' },
    { code: 'DS3102', name: 'Natural Language Processing', credits: 3, semester: 'Semester 5' },
    { code: 'DS3103', name: 'Computer Vision', credits: 3, semester: 'Semester 5' },
    { code: 'DS3201', name: 'Reinforcement Learning', credits: 3, semester: 'Semester 6' },
    { code: 'DS3202', name: 'Data Engineering & Pipelines', credits: 3, semester: 'Semester 6' },
    { code: 'DS3203', name: 'Ethical AI & Fairness', credits: 3, semester: 'Semester 6' },
    // Year 4
    { code: 'DS4101', name: 'Research Project (Part I)', credits: 6, semester: 'Semester 7' },
    { code: 'DS4102', name: 'MLOps & Production AI', credits: 3, semester: 'Semester 7' },
    { code: 'DS4103', name: 'Bayesian Methods', credits: 3, semester: 'Semester 7' },
    { code: 'DS4201', name: 'Research Project (Part II)', credits: 6, semester: 'Semester 8' },
    { code: 'DS4202', name: 'Applied AI Capstone', credits: 3, semester: 'Semester 8' },
    { code: 'DS4203', name: 'Research Dissemination', credits: 3, semester: 'Semester 8' },
  ],
};

export const VALID_GRADES = [
  'A+', 'A', 'A-',
  'B+', 'B', 'B-',
  'C+', 'C', 'C-',
  'D+', 'D',
  'E', 'F',
];

export const GRADE_POINT_MAP = {
  'A+': 4.0,
  'A':  4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B':  3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C':  2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D':  1.0,
  'E':  0.5,
  'F':  0.0,
};

// SUSL Faculty of Computing — Leadership & Curriculum Overview
export const FACULTY_INFO = {
  dean: 'Prof. S. Vasanthapriyan',
  departments: {
    'Software Engineering': {
      head: 'Mr. P. Vigneshwaran (Acting)',
      code: 'SE',
      color: 'blue',
      yearFocus: {
        'Year 1': 'Programming, Algorithms, Math, Statistics',
        'Year 2': 'Networks, DBMS, Web Systems, HCI',
        'Year 3': 'Security, Testing, Cloud, Architecture',
        'Year 4': 'Research Project, Training, ML, SOA',
      },
    },
    'Computer Information Systems': {
      head: 'Dr. (Mrs.) L.S. Lekamge',
      code: 'CIS',
      color: 'purple',
      yearFocus: {
        'Year 1': 'IT Fundamentals, Database, Web, HCI',
        'Year 2': 'Data Structures, Software Eng, Agile',
        'Year 3': 'Business Intelligence, Enterprise Arch',
        'Year 4': 'Research, Cloud, IT Law',
      },
    },
    'Data Science': {
      head: 'Dr. (Mrs.) U.A.P. Ishanka',
      code: 'DS',
      color: 'emerald',
      yearFocus: {
        'Year 1': 'Statistics, Python, EDA, Probability',
        'Year 2': 'ML, Big Data, Visualization',
        'Year 3': 'Deep Learning, NLP, Computer Vision',
        'Year 4': 'Research Project, MLOps, Applied AI',
      },
    },
  },
};
