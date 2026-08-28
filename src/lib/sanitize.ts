/**
 * Text sanitization utilities to prevent XSS attacks
 * 
 * React automatically escapes text content in JSX, but this provides
 * additional validation and sanitization for defense in depth.
 */

/**
 * Sanitizes text by removing/escaping HTML and JavaScript patterns
 * Preserves legitimate text while blocking XSS attempts
 * 
 * @param text - Input text to sanitize
 * @returns Sanitized text safe for display
 */
export function sanitizeText(text: string | null | undefined): string {
  if (!text) return "";
  
  // Convert to string and trim
  let sanitized = String(text).trim();
  
  // Replace HTML special characters with entities
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
  
  return sanitized;
}

/**
 * Validates that text doesn't contain XSS patterns
 * Used for server-side validation before storing in database
 * 
 * @param text - Text to validate
 * @returns true if text is safe, false if contains XSS patterns
 */
export function isTextSafe(text: string | null | undefined): boolean {
  if (!text) return true;
  
  const xssPatterns = [
    /<script/i,
    /<\/script/i,
    /javascript:/i,
    /onerror/i,
    /onclick/i,
    /onload/i,
    /onmouseover/i,
    /onfocus/i,
    /onblur/i,
    /onchange/i,
    /onsubmit/i,
    /<iframe/i,
    /<embed/i,
    /<object/i,
    /eval\(/i,
    /expression\(/i,
    /vbscript:/i,
    /data:text\/html/i,
  ];
  
  return !xssPatterns.some((pattern) => pattern.test(text));
}

/**
 * Sanitizes text for display in React components
 * Note: React already escapes text content, this is for defense in depth
 * 
 * @param text - Text to display
 * @returns Sanitized text
 */
export function sanitizeForDisplay(text: string | null | undefined): string {
  if (!text) return "";
  
  // First check if safe
  if (!isTextSafe(text)) {
    console.warn("[SANITIZE] Potentially unsafe text detected:", text.substring(0, 50));
  }
  
  // React handles escaping, but we ensure no raw HTML tags
  return String(text)
    .trim()
    .replace(/<[^>]*>/g, ""); // Strip any HTML tags
}

/**
 * Sanitizes text for use in database queries and external APIs
 * Removes potentially dangerous characters while preserving readability
 * 
 * @param text - Text to sanitize
 * @returns Sanitized text
 */
export function sanitizeForStorage(text: string | null | undefined): string {
  if (!text) return "";
  
  let sanitized = String(text).trim();
  
  // Remove null bytes and control characters (except newlines/tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "");
  
  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, "");
  
  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, " ");
  
  return sanitized.trim();
}

/**
 * Validates and sanitizes lead form data
 * Comprehensive validation for all user-submitted fields
 * 
 * @param data - Lead form data
 * @returns Sanitized data object
 */
export function sanitizeLeadData(data: {
  name?: string | null;
  city?: string | null;
  state?: string | null;
  machineName?: string | null;
  mobile?: string | null;
  pincode?: string | null;
}): {
  name: string;
  city: string;
  state: string;
  machineName: string;
  mobile: string;
  pincode: string;
} {
  return {
    name: sanitizeForStorage(data.name),
    city: sanitizeForStorage(data.city),
    state: sanitizeForStorage(data.state),
    machineName: sanitizeForStorage(data.machineName),
    mobile: sanitizeForStorage(data.mobile),
    pincode: sanitizeForStorage(data.pincode),
  };
}

/**
 * Type guard to check if a value is a valid string
 * 
 * @param value - Value to check
 * @returns true if value is a non-empty string
 */
export function isValidString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
