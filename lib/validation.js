/**
 * Input validation utilities for API routes
 * Ensures type safety and prevents injection attacks
 */

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  const errors = [];
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  return { valid: errors.length === 0, errors };
}

export function validateString(value, minLength = 1, maxLength = 1000, fieldName = 'field') {
  if (typeof value !== 'string') {
    return { valid: false, error: `${fieldName} must be a string` };
  }
  if (value.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} character(s)` };
  }
  if (value.length > maxLength) {
    return { valid: false, error: `${fieldName} must be at most ${maxLength} character(s)` };
  }
  return { valid: true };
}

export function validateNumber(value, min = null, max = null, fieldName = 'field') {
  if (typeof value !== 'number' || isNaN(value)) {
    return { valid: false, error: `${fieldName} must be a number` };
  }
  if (min !== null && value < min) {
    return { valid: false, error: `${fieldName} must be at least ${min}` };
  }
  if (max !== null && value > max) {
    return { valid: false, error: `${fieldName} must be at most ${max}` };
  }
  return { valid: true };
}

export function sanitizeString(value) {
  if (typeof value !== 'string') return '';
  // Remove special characters that could be used in NoSQL injection
  return value.replace(/[{}$]/g, '').trim();
}

export function validateGrade(grade) {
  const validGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
  return validGrades.includes(grade);
}

export function validateCredits(credits) {
  const validation = validateNumber(credits, 0, 10, 'Credits');
  if (!validation.valid) return validation;
  if (!Number.isInteger(credits)) {
    return { valid: false, error: 'Credits must be an integer' };
  }
  return { valid: true };
}

export function validateSemester(semester) {
  // Expected format: "Year 1 Fall" or "Year 2 Spring", etc.
  const semesterRegex = /^Year [1-4] (Fall|Spring)$/i;
  return semesterRegex.test(semester);
}

/**
 * Batch validate required fields in an object
 */
export function validateRequiredFields(data, requiredFields) {
  const missing = [];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missing.push(field);
    }
  }
  return { valid: missing.length === 0, missing };
}

export function getValidationErrorResponse(errors, statusCode = 400) {
  return {
    statusCode,
    error: Array.isArray(errors) ? errors[0] : errors,
    details: Array.isArray(errors) ? errors : [errors],
  };
}
