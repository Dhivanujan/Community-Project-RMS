
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const staffPassword = await bcrypt.hash('staff123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);
  
  // Create Staff
  const staff = await prisma.user.upsert({
    where: { username: 'staff1' },
    update: {},
    create: {
      username: 'staff1',
      email: 'staff1@faculty.edu',
      password: staffPassword,
      role: 'STAFF',
      isFirstLogin: false,
      active: true,
      staffProfile: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          employeeId: 'EMP001',
          department: 'Computing',
        },
      },
    },
  });
  console.log('Staff user created/verified:', staff.username);

  // Create Student
  const student = await prisma.user.upsert({
    where: { username: 'student1' },
    update: {},
    create: {
      username: 'student1',
      email: 'student1@faculty.edu',
      password: studentPassword,
      role: 'STUDENT',
      isFirstLogin: false,
      active: true,
      studentProfile: {
        create: {
          firstName: 'Jane',
          lastName: 'Smith',
          indexNumber: 'S001',
          department: 'Computing',
          enrollmentYear: '2024',
        },
      },
    },
  });
  console.log('Student user created/verified:', student.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
