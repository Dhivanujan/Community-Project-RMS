import prisma from "./prisma";

export async function logAction(userId, action, details = null, ipAddress = null) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details: details ? JSON.stringify(details) : null,
        ipAddress,
      },
    });
  } catch (error) {
    console.error("Failed to log action:", error);
  }
}
