/** Public contact shown on the site (email + CEO WhatsApp). */
export const SITE_PUBLIC_EMAIL = 'woyedeji7@gmail.com' as const;

/** Digits only, country code without +, for https://wa.me/ */
export const SITE_WHATSAPP_WA_ME = '2349027677640' as const;

export function whatsAppChatUrl(prefilledText?: string): string {
  const base = `https://wa.me/${SITE_WHATSAPP_WA_ME}`;
  if (prefilledText !== undefined && prefilledText.trim() !== '') {
    return `${base}?text=${encodeURIComponent(prefilledText)}`;
  }
  return base;
}
