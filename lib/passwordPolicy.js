import prisma from "@/lib/prisma";

export async function validatePassword(password) {
  // Fetch settings or use defaults if none exist
  let settings = await prisma.systemSettings.findFirst();
  
  if (!settings) {
    settings = {
      passwordMinLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    };
  }

  const errors = [];

  if (!password || password.length < settings.passwordMinLength) {
    errors.push(`Password must be at least ${settings.passwordMinLength} characters long.`);
  }

  if (settings.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }

  if (settings.requireNumbers && !/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number.");
  }

  // Define special chars based on common rules, matching the hint in Settings UI (!@#$%)
  if (settings.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>\-_+=\[\]\\/'`]/.test(password)) {
    errors.push("Password must contain at least one special character.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
