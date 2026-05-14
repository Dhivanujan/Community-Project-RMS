import { getServerSession } from "next-auth/next";
import { authOptions } from "./authOptions";
import { NextResponse } from "next/server";

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth(role = null) {
  const session = await getAuthSession();

  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  if (role && session.user.role !== role && session.user.role !== "SUPER_ADMIN") {
    return {
      authorized: false,
      response: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return { authorized: true, user: session.user };
}

export async function requireStudent() {
  return requireAuth("STUDENT");
}

export async function requireStaff() {
  return requireAuth("STAFF");
}

export async function requireSuperAdmin() {
  return requireAuth("SUPER_ADMIN");
}
