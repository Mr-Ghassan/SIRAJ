// SIRAJ website — the single content source for brand data. Every contact value comes from
// 00-Brand-Foundation/brand.config.json (the brand's source of truth); nothing is hard-coded here.
import brand from '../../../00-Brand-Foundation/brand.config.json';

const c = brand.contact as Record<string, string>;

export const SITE = {
  url: c.website_url,                       // https://www.sirajproperties.net (canonical)
  websiteDisplay: c.website_display,        // WWW.SIRAJPROPERTIES.NET
  lang: 'ar',
  dir: 'rtl',
  locale: 'ar_OM',
} as const;

export const CONTACT = {
  phone: c.phone,                           // 77714404 — tel: links only
  phoneDisplay: c.phone_display,            // «7771 4404» — every visible phone
  phoneIntl: `+968${c.phone}`,
  instagramUrl: c.instagram,
  instagramHandle: c.social_handle,         // SIRAJPROPERTIES — always with the Instagram icon, never «@»
  // WhatsApp is still marked «assumed — confirm» in the brand config, so it stays off in public UI until confirmed.
  whatsappConfirmed: !/assumed|confirm/i.test(c.whatsapp_status ?? ''),
  whatsappUrl: `https://wa.me/968${c.whatsapp}`,
} as const;

export const PROJECT = {
  city: brand.founding_project.location_ar, // مسقط
  description: 'شقق سكنية ومحلات تجارية',   // word for word (frozen rule)
} as const;

// Approved copy lines (Brand Identity v1.0). The line containing the typed name is intentionally not used on the
// website while the project-name decision is pending.
export const LINES = {
  firstLight: 'أوّلُ الضوء.',
  houseOfLight: 'في قلب المدينة، بيتٌ من ضوء.',
  curtain: 'حين يُرفع الستار، يتّضح كل شيء.',
  detail: 'مدروسة في كل تفاصيلها.',
} as const;

export const NAV = [
  { href: '/', label: 'الرئيسية', key: 'home' },
  { href: '/about/', label: 'عن الشركة', key: 'about' },
  { href: '/project/', label: 'المشروع', key: 'project' },
  { href: '/contact/', label: 'تواصل', key: 'contact' },
] as const;

export type NavKey = (typeof NAV)[number]['key'];
