import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    const authResult = await requireSuperAdmin();
    if (!authResult.authorized) return authResult.response;

    // Get user counts by role
    const [totalUsers, totalStudents, totalStaff, activeUsers, inactiveUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "STAFF" } }),
      prisma.user.count({ where: { active: true } }),
      prisma.user.count({ where: { active: false } }),
    ]);

    // Published results count
    const publishedResults = await prisma.resultUpload.count({
      where: { status: "published" },
    });

    // User growth - last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const usersByMonth = await prisma.user.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const userGrowth = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      userGrowth[key] = 0;
    }
    usersByMonth.forEach((u) => {
      const key = `${months[u.createdAt.getMonth()]} ${u.createdAt.getFullYear()}`;
      if (userGrowth[key] !== undefined) userGrowth[key]++;
    });

    const userGrowthData = Object.entries(userGrowth).map(([name, count]) => ({
      name: name.split(" ")[0],
      users: count,
    }));

    // Role distribution
    const roleDistribution = [
      { name: "Students", value: totalStudents, color: "#3b82f6" },
      { name: "Staff", value: totalStaff, color: "#8b5cf6" },
      { name: "Super Admin", value: await prisma.user.count({ where: { role: "SUPER_ADMIN" } }), color: "#e11d48" },
    ];

    // Recent login activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentLogins = await prisma.auditLog.findMany({
      where: {
        action: { in: ["SUCCESSFUL_LOGIN", "FAILED_LOGIN"] },
        createdAt: { gte: sevenDaysAgo },
      },
      select: { createdAt: true, action: true },
      orderBy: { createdAt: "asc" },
    });

    // Group login activity by day
    const loginActivity = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { weekday: "short" });
      loginActivity[key] = { success: 0, failed: 0 };
    }
    recentLogins.forEach((log) => {
      const key = log.createdAt.toLocaleDateString("en-US", { weekday: "short" });
      if (loginActivity[key]) {
        if (log.action === "SUCCESSFUL_LOGIN") loginActivity[key].success++;
        else loginActivity[key].failed++;
      }
    });

    const loginActivityData = Object.entries(loginActivity).map(([name, data]) => ({
      name,
      ...data,
    }));

    // Recent activities
    const recentActivities = await prisma.auditLog.findMany({
      take: 15,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { username: true, email: true, role: true } },
      },
    });

    // Result publishing stats
    const resultStats = await prisma.resultUpload.groupBy({
      by: ["status"],
      _count: true,
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalStudents,
        totalStaff,
        activeUsers,
        inactiveUsers,
        publishedResults,
      },
      charts: {
        userGrowth: userGrowthData,
        loginActivity: loginActivityData,
        roleDistribution,
        resultStats: resultStats.map((r) => ({
          name: r.status.charAt(0).toUpperCase() + r.status.slice(1),
          value: r._count,
        })),
      },
      recentActivities: recentActivities.map((a) => ({
        id: a.id,
        action: a.action,
        details: a.details,
        user: a.user?.username || "System",
        role: a.user?.role || "SYSTEM",
        timestamp: a.createdAt,
        status: a.status,
      })),
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
