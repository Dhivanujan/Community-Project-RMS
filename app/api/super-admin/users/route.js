import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { requireSuperAdmin } from "@/lib/auth";
import { logAction } from "@/lib/audit";
import { sendWelcomeEmail } from "@/lib/email";

export async function GET(req) {
  try {
    const authResult = await requireSuperAdmin();
    if (!authResult.authorized) return authResult.response;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const where = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status === "active") where.active = true;
    if (status === "inactive") where.active = false;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          active: true,
          isFirstLogin: true,
          lastLogin: true,
          department: true,
          createdAt: true,
          updatedAt: true,
          staffProfile: { select: { firstName: true, lastName: true, employeeId: true, department: true } },
          studentProfile: { select: { firstName: true, lastName: true, indexNumber: true, department: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Users GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authResult = await requireSuperAdmin();
    if (!authResult.authorized) return authResult.response;

    const body = await req.json();
    const { fullName, username, email, role, department, password, studentId, enrollmentYear } = body;

    if (!fullName || !username || !role) {
      return NextResponse.json({ message: "Full name, username, and role are required" }, { status: 400 });
    }

    if (role === "STUDENT") {
      if (!studentId || !enrollmentYear) {
        return NextResponse.json({ message: "Student ID and enrollment year are required for students" }, { status: 400 });
      }
      if (!/^\d{4}\/\d{4}$/.test(enrollmentYear)) {
        return NextResponse.json({ message: "Enrollment Year must be in format YYYY/YYYY (e.g., 2021/2022)" }, { status: 400 });
      }
    }

    // Check existing user
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, ...(email ? [{ email }] : [])] },
    });
    if (existing) {
      return NextResponse.json({ message: "Username or email already exists" }, { status: 409 });
    }

    if (role === "STUDENT") {
      const existingStudent = await prisma.studentProfile.findUnique({
        where: { indexNumber: studentId },
      });
      if (existingStudent) {
        return NextResponse.json({ message: "Student ID already exists" }, { status: 409 });
      }
    }

    const tempPassword = password || Math.random().toString(36).slice(-10) + "A1!";
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || firstName;

    const userData = {
      username,
      email: email ? email : undefined,
      password: hashedPassword,
      role,
      isFirstLogin: true,
      active: true,
      department: department ? department : undefined,
    };

    // Create profile based on role
    if (role === "STAFF" || role === "SUPER_ADMIN") {
      userData.staffProfile = {
        create: {
          firstName,
          lastName,
          employeeId: `EMP-${Date.now().toString(36).toUpperCase()}`,
          department: department ? department : undefined,
        },
      };
    } else if (role === "STUDENT") {
      userData.studentProfile = {
        create: {
          firstName,
          lastName,
          indexNumber: studentId,
          rollNumber: studentId,
          department: department ? department : undefined,
          enrollmentYear,
        },
      };
    }

    const user = await prisma.user.create({
      data: userData,
      select: { id: true, username: true, role: true },
    });

    await logAction(authResult.user.id, "USER_CREATED", { userId: user.id, username, role }, null, {
      entity: "User",
      entityId: user.id,
    });

    if (email) {
      await sendWelcomeEmail(email, username, tempPassword, role);
    }

    return NextResponse.json({
      message: "User created successfully",
      user,
      tempPassword,
    }, { status: 201 });
  } catch (error) {
    console.error("Users POST error:", error);
    return NextResponse.json({ message: "Failed to create user", error: error?.message || String(error) }, { status: 500 });
  }
}
