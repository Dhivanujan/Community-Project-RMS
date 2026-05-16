"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { logAction } from "@/lib/audit";

export async function changePassword(formData) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };

  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    return { error: "Invalid current password" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      password: hashedPassword,
      isFirstLogin: false,
    },
  });

  await logAction(session.user.id, "PASSWORD_CHANGE", "User changed their password");

  return { success: true };
}

export async function createStaff(data) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    return { error: "Unauthorized" };
  }

  const { username, email, firstName, lastName, employeeId, department } = data;

  // Auto-generate temporary password
  const tempPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "STAFF",
        isFirstLogin: true,
        staffProfile: {
          create: {
            firstName,
            lastName,
            employeeId,
            department,
          },
        },
      },
    });

    await logAction(session.user.id, "STAFF_CREATION", { staffId: user.id });

    return { success: true, tempPassword };
  } catch (error) {
    return { error: "Username or email already exists" };
  }
}

export async function createStudent(data) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "STAFF" && session?.user?.role !== "SUPER_ADMIN") {
    return { error: "Unauthorized" };
  }

  const { username, email, firstName, lastName, indexNumber, department, enrollmentYear } = data;

  const tempPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "STUDENT",
        isFirstLogin: true,
        studentProfile: {
          create: {
            firstName,
            lastName,
            indexNumber,
            rollNumber: indexNumber, // Fallback to indexNumber to prevent unique constraint error on null
            department,
            enrollmentYear,
          },
        },
      },
    });

    await logAction(session.user.id, "STUDENT_CREATION", { studentId: user.id });

    return { success: true, tempPassword };
  } catch (error) {
    console.error("Prisma error in createStudent:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}
