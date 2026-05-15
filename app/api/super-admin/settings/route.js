import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";
import { logAction } from "@/lib/audit";

export async function GET(req) {
  try {
    const authResult = await requireSuperAdmin();
    if (!authResult.authorized) return authResult.response;

    let settings = await prisma.systemSettings.findFirst();

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.systemSettings.create({ data: {} });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const authResult = await requireSuperAdmin();
    if (!authResult.authorized) return authResult.response;

    const body = await req.json();

    let settings = await prisma.systemSettings.findFirst();

    if (!settings) {
      settings = await prisma.systemSettings.create({ data: {} });
    }

    const oldSettings = { ...settings };

    const updatedSettings = await prisma.systemSettings.update({
      where: { id: settings.id },
      data: body,
    });

    await logAction(authResult.user.id, "SETTINGS_UPDATED", {
      changes: Object.keys(body),
    }, null, {
      entity: "SystemSettings",
      entityId: settings.id,
      oldValues: oldSettings,
      newValues: body,
    });

    return NextResponse.json({ settings: updatedSettings, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ message: "Failed to update settings" }, { status: 500 });
  }
}
