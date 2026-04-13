'use client';

import emailjs from '@emailjs/browser';
import type { EmailjsSendResult } from '@/types';
import type { SendClientConfirmationEmailParams, SendTourRequestParams } from '@/types';

function getPublicKey(): string | undefined {
  return process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim();
}

/** Initialize EmailJS (safe to call multiple times). */
export function initEmailJS(): void {
  const publicKey = getPublicKey();
  if (!publicKey) {
    return;
  }
  emailjs.init({ publicKey });
}

function getSendOptions(): { publicKey: string } | undefined {
  const publicKey = getPublicKey();
  return publicKey ? { publicKey } : undefined;
}

/**
 * Send tour request notification via EmailJS
 */
export async function sendTourRequestEmail({
  clientName,
  clientEmail,
  propertyTitle,
  message,
}: SendTourRequestParams): Promise<EmailjsSendResult> {
  try {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.trim();
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID?.trim();
    const options = getSendOptions();

    if (!serviceId || !templateId || !options) {
      return {
        success: false,
        error: new Error('Email service is not configured'),
      };
    }

    const submittedAt = new Date().toLocaleString('en-NG', {
      timeZone: 'Africa/Lagos',
      dateStyle: 'long',
      timeStyle: 'short',
    });

    const templateParams: Record<string, string | undefined> = {
      client_name: clientName,
      client_email: clientEmail,
      property_title: propertyTitle?.trim() || '',
      message,
      submitted_at: submittedAt,
      admin_email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    };

    const response = await emailjs.send(serviceId, templateId, templateParams, options);
    return { success: true, response };
  } catch (error) {
    console.error('EmailJS tour request error:', error);
    return { success: false, error };
  }
}

/**
 * Send auto-reply confirmation to client (requires client template in EmailJS).
 */
export async function sendClientConfirmationEmail({
  clientName,
  clientEmail,
  propertyTitle,
}: SendClientConfirmationEmailParams): Promise<EmailjsSendResult> {
  try {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.trim();
    const clientTemplateId = process.env.NEXT_PUBLIC_EMAILJS_CLIENT_TEMPLATE_ID?.trim();
    const options = getSendOptions();

    if (!clientTemplateId) {
      return { success: false, error: new Error('Client confirmation template is not configured') };
    }

    if (!serviceId || !options) {
      return {
        success: false,
        error: new Error('Email service is not configured'),
      };
    }

    const templateParams: Record<string, string> = {
      client_name: clientName,
      client_email: clientEmail,
      property_title: propertyTitle || 'our property',
      reply_to: clientEmail,
    };

    const response = await emailjs.send(serviceId, clientTemplateId, templateParams, options);
    return { success: true, response };
  } catch (error) {
    console.error('EmailJS client confirmation error:', error);
    return { success: false, error };
  }
}
