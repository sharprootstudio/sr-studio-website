// ==============================================================================
// SR STUDIO — TEST SUITE: LEAD SUBMISSION VALIDATION & BOT DEFENSE
// File: tests/lead-validation.test.ts
// ==============================================================================

import { describe, it, expect } from 'vitest';

// Core validation rules matching ContactSection.tsx and Supabase Edge Function submit-lead
export function validateLeadSubmission(payload: {
  name?: string;
  email?: string;
  company?: string;
  service?: string;
  details?: string;
  honeypot?: string;
  idempotency_key?: string;
}) {
  const errors: Record<string, string> = {};

  // 1. Honeypot Bot Trap check
  const isBot = Boolean(payload.honeypot && payload.honeypot.trim() !== '');
  if (isBot) {
    return {
      isValid: false,
      isBot: true,
      errors: { bot: 'Spam submission detected by honeypot.' },
      normalized: null,
    };
  }

  // 2. Name validation
  const trimmedName = (payload.name || '').trim();
  if (!trimmedName) {
    errors.name = 'Please provide your full name.';
  } else if (trimmedName.length < 2 || trimmedName.length > 100) {
    errors.name = 'Full name must be between 2 and 100 characters.';
  }

  // 3. Email validation & normalization
  const trimmedEmail = (payload.email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail) {
    errors.email = 'Please provide your email address.';
  } else if (!emailRegex.test(trimmedEmail)) {
    errors.email = 'Please provide a valid email address (e.g. name@company.com).';
  } else if (trimmedEmail.length > 150) {
    errors.email = 'Email address cannot exceed 150 characters.';
  }

  // 4. Company validation (optional)
  const trimmedCompany = (payload.company || '').trim();
  if (trimmedCompany.length > 100) {
    errors.company = 'Company name cannot exceed 100 characters.';
  }

  // 5. Details / Message validation
  const trimmedDetails = (payload.details || '').trim();
  if (!trimmedDetails) {
    errors.details = 'Please share a brief summary of your project or inquiry.';
  } else if (trimmedDetails.length < 5) {
    errors.details = 'Project details must be at least 5 characters.';
  } else if (trimmedDetails.length > 3000) {
    errors.details = 'Project details cannot exceed 3000 characters.';
  }

  // 6. Idempotency Key validation (optional but if provided must match UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (payload.idempotency_key && !uuidRegex.test(payload.idempotency_key)) {
    errors.idempotency_key = 'Invalid idempotency key format.';
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    isBot: false,
    errors,
    normalized: isValid
      ? {
          name: trimmedName,
          email: trimmedEmail,
          company: trimmedCompany || null,
          service: (payload.service || 'General Inquiry').trim(),
          details: trimmedDetails,
          idempotency_key: payload.idempotency_key || null,
        }
      : null,
  };
}

describe('SR Studio — Lead Submission Validation', () => {
  it('accepts a fully compliant, high-quality client inquiry', () => {
    const validPayload = {
      name: 'Sarah Connor',
      email: 'Sarah@CyberdyneSystems.com  ',
      company: 'Cyberdyne Systems',
      service: 'AI Solutions & Automation',
      details: 'We require an autonomous AI agent to automate data processing across our warehouse operations.',
      idempotency_key: '550e8400-e29b-41d4-a716-446655440000',
    };

    const result = validateLeadSubmission(validPayload);
    expect(result.isValid).toBe(true);
    expect(result.isBot).toBe(false);
    expect(result.errors).toEqual({});
    expect(result.normalized).toEqual({
      name: 'Sarah Connor',
      email: 'sarah@cyberdynesystems.com', // normalized lowercase and trimmed
      company: 'Cyberdyne Systems',
      service: 'AI Solutions & Automation',
      details: 'We require an autonomous AI agent to automate data processing across our warehouse operations.',
      idempotency_key: '550e8400-e29b-41d4-a716-446655440000',
    });
  });

  it('rejects submissions with missing or short names', () => {
    const emptyName = validateLeadSubmission({
      name: '   ',
      email: 'user@example.com',
      details: 'Valid inquiry details here',
    });
    expect(emptyName.isValid).toBe(false);
    expect(emptyName.errors.name).toBe('Please provide your full name.');

    const singleChar = validateLeadSubmission({
      name: 'A',
      email: 'user@example.com',
      details: 'Valid inquiry details here',
    });
    expect(singleChar.isValid).toBe(false);
    expect(singleChar.errors.name).toBe('Full name must be between 2 and 100 characters.');
  });

  it('rejects names exceeding 100 characters', () => {
    const longName = 'A'.repeat(101);
    const result = validateLeadSubmission({
      name: longName,
      email: 'user@example.com',
      details: 'Valid inquiry details here',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Full name must be between 2 and 100 characters.');
  });

  it('rejects invalid email formats', () => {
    const invalidEmails = [
      'plainaddress',
      '#@%^%#$@#$@#.com',
      '@example.com',
      'email@example@example.com',
      'email.example.com',
      'email@example',
      'email@example.',
    ];

    invalidEmails.forEach(email => {
      const res = validateLeadSubmission({
        name: 'Valid Name',
        email,
        details: 'Valid inquiry details here',
      });
      expect(res.isValid).toBe(false);
      expect(res.errors.email).toBe('Please provide a valid email address (e.g. name@company.com).');
    });
  });

  it('rejects email addresses exceeding 150 characters', () => {
    const longLocal = 'a'.repeat(140);
    const result = validateLeadSubmission({
      name: 'Valid Name',
      email: `${longLocal}@example.com`,
      details: 'Valid inquiry details here',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('Email address cannot exceed 150 characters.');
  });

  it('validates project details length boundaries (5 min, 3000 max)', () => {
    const shortDetails = validateLeadSubmission({
      name: 'Valid Name',
      email: 'user@example.com',
      details: 'Hi',
    });
    expect(shortDetails.isValid).toBe(false);
    expect(shortDetails.errors.details).toBe('Project details must be at least 5 characters.');

    const excessiveDetails = validateLeadSubmission({
      name: 'Valid Name',
      email: 'user@example.com',
      details: 'X'.repeat(3001),
    });
    expect(excessiveDetails.isValid).toBe(false);
    expect(excessiveDetails.errors.details).toBe('Project details cannot exceed 3000 characters.');
  });

  it('detects and traps bot submissions using honeypot field', () => {
    const botSubmission = {
      name: 'Spam Bot',
      email: 'spammer@botnet.ru',
      company: 'Crypto SEO scam',
      details: 'Buy cheap backlink services now!',
      honeypot: 'http://spam-site-trap.com', // Filled by automated bot
    };

    const result = validateLeadSubmission(botSubmission);
    expect(result.isValid).toBe(false);
    expect(result.isBot).toBe(true);
    expect(result.errors.bot).toBeDefined();
    expect(result.normalized).toBeNull();
  });

  it('validates idempotency key format to prevent malformed or duplicate requests', () => {
    const invalidIdempotency = validateLeadSubmission({
      name: 'Valid Name',
      email: 'user@example.com',
      details: 'Valid inquiry details here',
      idempotency_key: 'not-a-valid-uuid',
    });
    expect(invalidIdempotency.isValid).toBe(false);
    expect(invalidIdempotency.errors.idempotency_key).toBe('Invalid idempotency key format.');

    const validIdempotency = validateLeadSubmission({
      name: 'Valid Name',
      email: 'user@example.com',
      details: 'Valid inquiry details here',
      idempotency_key: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    });
    expect(validIdempotency.isValid).toBe(true);
  });
});

