import prisma from "./prisma";

/**
 * Enhanced audit logging utility
 * Tracks all system activities with before/after values, IP, and user agent
 */
export async function logAction(userId, action, details = null, ipAddress = null, extra = {}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity: extra.entity || null,
        entityId: extra.entityId || null,
        details: details ? (typeof details === "string" ? details : JSON.stringify(details)) : null,
        oldValues: extra.oldValues ? JSON.stringify(extra.oldValues) : null,
        newValues: extra.newValues ? JSON.stringify(extra.newValues) : null,
        ipAddress,
        userAgent: extra.userAgent || null,
        status: extra.status || "success",
      },
    });
  } catch (error) {
    console.error("Failed to log action:", error);
  }
}

/**
 * Log login activity separately for analytics
 */
export async function logLogin(userId, action, success = true, ipAddress = null, userAgent = null) {
  try {
    await prisma.loginLog.create({
      data: {
        userId,
        action,
        success,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to log login:", error);
  }
}
