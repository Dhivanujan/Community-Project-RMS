const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const FIRST_NAMES = [
  'Aarav', 'Arjun', 'Sanjay', 'Lathusan', 'Tharindu', 'Nipun', 'Dilshan', 'Kasun', 'Ruwan', 'Prabath',
  'Sachin', 'Janith', 'Sandun', 'Pathum', 'Chathura', 'Roshan', 'Dinesh', 'Kavindu', 'Lahiru', 'Ishara',
  'Pasan', 'Amila', 'Nuwan', 'Duminda', 'Suresh', 'Manuja', 'Subodh', 'Danushka', 'Shehan', 'Ruvindhu'
];

const LAST_NAMES = [
  'Silva', 'Perera', 'Fernando', 'Jayasinghe', 'Gunawardena', 'Ranasinghe', 'Herath', 'Bandara', 'Dissanayake', 'Senanayake',
  'Wijesinghe', 'Rathnayake', 'Dias', 'Mendis', 'Rodrigo', 'Peiris', 'Cooray', 'Alwis', 'Nanayakkara', 'Amarasinghe',
  'Samarasinghe', 'Ekanayake', 'Liyanage', 'Hewage', 'Jayawardena', 'Karunaratne', 'Premachandra', 'Wickramasinghe', 'De Silva', 'Jayasuriya'
];

const DEPARTMENTS = [
  { name: 'Software Engineering', code: 'SE' },
  { name: 'Computer Information Systems', code: 'CIS' },
  { name: 'Data Science', code: 'DS' }
];

const YEARS = [
  { enrollmentYear: '2024/2025', batchCode: '24' },
  { enrollmentYear: '2023/2024', batchCode: '23' },
  { enrollmentYear: '2022/2023', batchCode: '22' },
  { enrollmentYear: '2021/2022', batchCode: '21' },
  { enrollmentYear: '2020/2021', batchCode: '20' }
];

async function main() {
  console.log('Starting student seeding...');
  const passwordHash = await bcrypt.hash('student123', 10);
  console.log('Password hash generated.');

  // 1. Seed departments into the Department table
  for (const dept of DEPARTMENTS) {
    await prisma.department.upsert({
      where: { name: dept.name },
      update: { code: dept.code, active: true },
      create: {
        name: dept.name,
        code: dept.code,
        faculty: 'Faculty of Computing',
        active: true
      }
    });
  }
  console.log('Departments seeded.');

  let createdCount = 0;
  let updatedCount = 0;

  // 2. Loop through departments, years, and generate 10 students
  for (const dept of DEPARTMENTS) {
    for (const yr of YEARS) {
      console.log(`Seeding 10 students for ${dept.name} (${yr.enrollmentYear})...`);
      
      for (let i = 1; i <= 10; i++) {
        // Pad number: e.g. 001, 002, ..., 010
        const studentNum = String(i).padStart(3, '0');
        const indexNumber = `${yr.batchCode}${dept.code}${studentNum}`;
        const username = indexNumber.toLowerCase();
        const email = `${username}@foc.sab.ac.lk`;
        
        // Pick names deterministically using department, year and index
        const nameIdx1 = (dept.name.charCodeAt(0) + yr.batchCode.charCodeAt(0) + i) % FIRST_NAMES.length;
        const nameIdx2 = (dept.name.charCodeAt(1) + yr.batchCode.charCodeAt(1) + i + 5) % LAST_NAMES.length;
        const firstName = FIRST_NAMES[nameIdx1];
        const lastName = LAST_NAMES[nameIdx2];

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { username },
          include: { studentProfile: true }
        });

        if (existingUser) {
          // Update existing
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              email,
              active: true,
              role: 'STUDENT'
            }
          });

          if (existingUser.studentProfile) {
            await prisma.studentProfile.update({
              where: { id: existingUser.studentProfile.id },
              data: {
                firstName,
                lastName,
                indexNumber,
                rollNumber: indexNumber,
                department: dept.name,
                enrollmentYear: yr.enrollmentYear
              }
            });
          } else {
            await prisma.studentProfile.create({
              data: {
                userId: existingUser.id,
                firstName,
                lastName,
                indexNumber,
                rollNumber: indexNumber,
                department: dept.name,
                enrollmentYear: yr.enrollmentYear
              }
            });
          }
          updatedCount++;
        } else {
          // Create new
          await prisma.user.create({
            data: {
              username,
              email,
              password: passwordHash,
              role: 'STUDENT',
              isFirstLogin: false,
              active: true,
              studentProfile: {
                create: {
                  firstName,
                  lastName,
                  indexNumber,
                  rollNumber: indexNumber,
                  department: dept.name,
                  enrollmentYear: yr.enrollmentYear
                }
              }
            }
          });
          createdCount++;
        }
      }
    }
  }

  console.log(`\nSeeding completed!`);
  console.log(`Created: ${createdCount} new students.`);
  console.log(`Updated: ${updatedCount} existing students.`);
}

main()
  .catch((e) => {
    console.error('Error seeding students:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
