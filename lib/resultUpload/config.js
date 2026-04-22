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
  { value: 'Computer Science', label: 'Computer Science (CS)' },
  { value: 'Software Engineering', label: 'Software Engineering (SE)' },
  { value: 'Information Technology', label: 'Information Technology (IT)' },
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

// Subjects organized by department
export const SUBJECTS = {
  'Computer Science': [
    { code: 'CS1010', name: 'Introduction to Programming', credits: 3, semester: 'Semester 1' },
    { code: 'CS1020', name: 'Discrete Mathematics', credits: 3, semester: 'Semester 1' },
    { code: 'CS2010', name: 'Data Structures & Algorithms', credits: 4, semester: 'Semester 2' },
    { code: 'CS2020', name: 'Object-Oriented Programming', credits: 3, semester: 'Semester 2' },
    { code: 'CS3010', name: 'Database Management Systems', credits: 3, semester: 'Semester 3' },
    { code: 'CS3020', name: 'Computer Networks', credits: 3, semester: 'Semester 3' },
    { code: 'CS4010', name: 'Operating Systems', credits: 4, semester: 'Semester 4' },
    { code: 'CS4020', name: 'Software Engineering', credits: 3, semester: 'Semester 4' },
  ],
  'Software Engineering': [
    { code: 'SE1010', name: 'Fundamentals of Computing', credits: 3, semester: 'Semester 1' },
    { code: 'SE1020', name: 'Mathematics for Computing', credits: 3, semester: 'Semester 1' },
    { code: 'SE2010', name: 'Object-Oriented Analysis & Design', credits: 4, semester: 'Semester 2' },
    { code: 'SE2020', name: 'Web Application Development', credits: 3, semester: 'Semester 2' },
    { code: 'SE3010', name: 'Software Architecture', credits: 3, semester: 'Semester 3' },
    { code: 'SE3020', name: 'Distributed Systems', credits: 3, semester: 'Semester 3' },
    { code: 'SE4010', name: 'Software Quality Assurance', credits: 4, semester: 'Semester 4' },
    { code: 'SE4020', name: 'Project Management', credits: 3, semester: 'Semester 4' },
  ],
  'Information Technology': [
    { code: 'IT1010', name: 'IT Fundamentals', credits: 3, semester: 'Semester 1' },
    { code: 'IT1020', name: 'Computer Hardware & Systems', credits: 3, semester: 'Semester 1' },
    { code: 'IT2010', name: 'Information Systems', credits: 4, semester: 'Semester 2' },
    { code: 'IT2020', name: 'Networking Essentials', credits: 3, semester: 'Semester 2' },
    { code: 'IT3010', name: 'Cybersecurity Fundamentals', credits: 3, semester: 'Semester 3' },
    { code: 'IT3020', name: 'Cloud Computing', credits: 3, semester: 'Semester 3' },
    { code: 'IT4010', name: 'Enterprise Systems', credits: 4, semester: 'Semester 4' },
    { code: 'IT4020', name: 'IT Governance', credits: 3, semester: 'Semester 4' },
  ],
  'Data Science': [
    { code: 'DS1010', name: 'Introduction to Data Science', credits: 3, semester: 'Semester 1' },
    { code: 'DS1020', name: 'Statistics for Computing', credits: 3, semester: 'Semester 1' },
    { code: 'DS2010', name: 'Machine Learning Foundations', credits: 4, semester: 'Semester 2' },
    { code: 'DS2020', name: 'Data Wrangling', credits: 3, semester: 'Semester 2' },
    { code: 'DS3010', name: 'Deep Learning', credits: 3, semester: 'Semester 3' },
    { code: 'DS3020', name: 'Big Data Technologies', credits: 3, semester: 'Semester 3' },
    { code: 'DS4010', name: 'Natural Language Processing', credits: 4, semester: 'Semester 4' },
    { code: 'DS4020', name: 'Data Visualization', credits: 3, semester: 'Semester 4' },
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
