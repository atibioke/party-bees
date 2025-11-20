/**
 * Validates and formats Nigerian phone numbers
 * Accepts formats: +234XXXXXXXXXX, 234XXXXXXXXXX, 0XXXXXXXXXX, XXXXXXXXXX
 * Returns standardized format: +234XXXXXXXXXX
 */

export function validateNigerianPhone(phone: string): {
  isValid: boolean;
  formatted: string | null;
  error: string | null;
} {
  if (!phone || typeof phone !== 'string') {
    return {
      isValid: false,
      formatted: null,
      error: 'Phone number is required'
    };
  }

  // Remove all whitespace and special characters except + and digits
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Check if it's empty after cleaning
  if (!cleaned) {
    return {
      isValid: false,
      formatted: null,
      error: 'Phone number is required'
    };
  }

  // Pattern: +234 followed by 10 digits, or 234 followed by 10 digits, or 0 followed by 10 digits, or 10 digits starting with 7, 8, or 9
  const patterns = [
    /^\+234[789]\d{9}$/,      // +234XXXXXXXXXX (11 digits after +234)
    /^234[789]\d{9}$/,        // 234XXXXXXXXXX (11 digits after 234)
    /^0[789]\d{9}$/,          // 0XXXXXXXXXX (11 digits starting with 0)
    /^[789]\d{9}$/,           // XXXXXXXXXX (10 digits starting with 7, 8, or 9)
  ];

  let formatted: string | null = null;

  // Check each pattern and format accordingly
  if (patterns[0].test(cleaned)) {
    // Already in +234 format
    formatted = cleaned;
  } else if (patterns[1].test(cleaned)) {
    // 234 format - add +
    formatted = `+${cleaned}`;
  } else if (patterns[2].test(cleaned)) {
    // 0XXXXXXXXXX format - replace 0 with +234
    formatted = `+234${cleaned.substring(1)}`;
  } else if (patterns[3].test(cleaned)) {
    // XXXXXXXXXX format - add +234
    formatted = `+234${cleaned}`;
  } else {
    return {
      isValid: false,
      formatted: null,
      error: 'Invalid Nigerian phone number. Use format: +234 800 000 0000 or 0800 000 0000'
    };
  }

  return {
    isValid: true,
    formatted,
    error: null
  };
}

/**
 * Formats phone number for display (e.g., +234 800 000 0000)
 */
export function formatPhoneForDisplay(phone: string): string {
  const validation = validateNigerianPhone(phone);
  if (!validation.isValid || !validation.formatted) {
    return phone; // Return original if invalid
  }

  // Format as +234 XXX XXX XXXX
  const digits = validation.formatted.substring(4); // Remove +234
  return `+234 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
}

/**
 * Formats phone number for WhatsApp URL (removes +)
 */
export function formatPhoneForWhatsApp(phone: string): string {
  const validation = validateNigerianPhone(phone);
  if (!validation.isValid || !validation.formatted) {
    return phone.replace(/[^\d]/g, ''); // Fallback: just digits
  }
  return validation.formatted.replace(/\+/g, '');
}

