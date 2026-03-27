/**
 * Validation schemas using Zod for LinkSutra
 * Provides client-side validation for forms
 */
import { z } from 'zod';

// ─── AUTH VALIDATION ─────────────────────────────────────────────────

export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters');

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(50, 'Username must be less than 50 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');

export const displayNameSchema = z
  .string()
  .max(100, 'Display name must be less than 100 characters')
  .optional();

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  displayName: displayNameSchema,
});

// ─── LINK VALIDATION ─────────────────────────────────────────────────

export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .min(1, 'URL is required')
  .max(2048, 'URL is too long')
  .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
    message: 'URL must start with http:// or https://',
  });

export const linkTitleSchema = z
  .string()
  .min(1, 'Title is required')
  .max(200, 'Title must be less than 200 characters')
  .transform((val) => val.trim());

export const linkIconSchema = z
  .string()
  .max(500, 'Icon must be less than 500 characters')
  .optional();

export const linkCreateSchema = z.object({
  title: linkTitleSchema,
  url: urlSchema,
  icon: linkIconSchema,
});

export const linkUpdateSchema = z.object({
  title: linkTitleSchema.optional(),
  url: urlSchema.optional(),
  icon: linkIconSchema,
});

// ─── PROFILE VALIDATION ──────────────────────────────────────────────

export const bioSchema = z
  .string()
  .max(500, 'Bio must be less than 500 characters')
  .optional();

export const avatarUrlSchema = z
  .string()
  .url('Please enter a valid avatar URL')
  .max(2048, 'Avatar URL is too long')
  .optional()
  .or(z.literal(''));

export const profileUpdateSchema = z.object({
  displayName: displayNameSchema,
  bio: bioSchema,
  avatarUrl: avatarUrlSchema,
});

// ─── VALIDATION HELPER FUNCTIONS ─────────────────────────────────────

/**
 * Validate data against a schema and return errors
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {object} data - Data to validate
 * @returns {{ success: boolean, errors: object | null, data: object | null }}
 */
export function validate(schema, data) {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      errors: null,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Transform Zod errors to a simple object
      const errors = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return {
        success: false,
        errors,
        data: null,
      };
    }
    throw error;
  }
}

/**
 * Validate a single field
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {any} value - Value to validate
 * @returns {{ success: boolean, error: string | null }}
 */
export function validateField(schema, value) {
  try {
    schema.parse(value);
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Validation failed',
      };
    }
    throw error;
  }
}

/**
 * Check if a URL is valid
 * @param {string} url - URL to check
 * @returns {boolean}
 */
export function isValidUrl(url) {
  const result = validateField(urlSchema, url);
  return result.success;
}

/**
 * Check if an email is valid
 * @param {string} email - Email to check
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const result = validateField(emailSchema, email);
  return result.success;
}

/**
 * Get password strength
 * @param {string} password - Password to check
 * @returns {{ strength: 'weak' | 'medium' | 'strong', feedback: string[] }}
 */
export function getPasswordStrength(password) {
  const feedback = [];
  let strength = 'weak';

  if (password.length < 8) {
    feedback.push('Use at least 8 characters');
  }

  if (password.length >= 8 && password.length < 12) {
    strength = 'medium';
  }

  if (password.length >= 12) {
    strength = 'strong';
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('Add an uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    feedback.push('Add a lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    feedback.push('Add a number');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.push('Add a special character');
  }

  // Upgrade strength if all criteria met
  if (feedback.length === 0 && password.length >= 12) {
    strength = 'strong';
  } else if (feedback.length <= 2 && password.length >= 10) {
    strength = 'medium';
  }

  return { strength, feedback };
}
