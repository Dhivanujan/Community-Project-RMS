import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { requireSuperAdmin } from "@/lib/auth";
import { logAction } from "@/lib/audit";

export async function GET(req, { params }) {
  try {
    const authResult = await requireSuperAdmin();
    if (!authResult.authorized) return authResult.response;

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        active: true,
        isFirstLogin: true,
        lastLogin: true,
        department: true,
        failedLoginCount: true,
        lockUntil: true,
        createdAt: true,
        updatedAt: true,
        staffProfile: true,
        studentProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("User GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const authResult = await requireSuperAdmin();
    if (!authResult.authorized) return authResult.response;

    const { id } = await params;
    const body = await req.json();

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Build update data
    const updateData = {};
    const allowedFields = ["username", "email", "role", "active", "department", "isFirstLogin"];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Handle password reset
    if (body.newPassword) {
      updateData.password = await bcrypt.hash(body.newPassword, 12);
      updateData.isFirstLogin = true;
    }

    // Handle force password reset
    if (body.forcePasswordReset) {
      updateData.isFirstLogin = true;
    }

    // Handle unlock account
    if (body.unlockAccount) {
      updateData.failedLoginCount = 0;
      updateData.lockUntil = null;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, username: true, role: true, active: true },
    });

    await logAction(authResult.user.id, "USER_UPDATED", {
      userId: id,
      changes: Object.keys(updateData),
    }, null, {
      entity: "User",
      entityId: id,
      oldValues: {
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
        active: existingUser.active,
      },
      newValues: updateData,
    });

    return NextResponse.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("User PATCH error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ message: "Username or email already exists" }, { status: 409 });
    }
    return NextResponse.json({ message: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const authResult = await requireSuperAdmin();
    if (!authResult.authorized) return authResult.response;

    const { id } = await params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Prevent self-deletion
    if (user.id === authResult.user.id) {
      return NextResponse.json({ message: "Cannot delete your own account" }, { status: 403 });
    }

    // Delete related profiles first
    await prisma.staffProfile.deleteMany({ where: { userId: id } });
    await prisma.studentProfile.deleteMany({ where: { userId: id } });

    await prisma.user.delete({ where: { id } });

    await logAction(authResult.user.id, "USER_DELETED", {
      deletedUser: user.username,
      role: user.role,
    }, null, {
      entity: "User",
      entityId: id,
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("User DELETE error:", error);
    return NextResponse.json({ message: "Failed to delete user" }, { status: 500 });
  }
}
