// SIRAJ website — forms contract v1 (Contact + Register Interest).
// Customer data is never sent anywhere unless an approved HTTPS endpoint is configured at build time:
//   PUBLIC_SIRAJ_FORMS_ENDPOINT=https://<approved company endpoint>   (see docs/digital/forms-contract.md)
// Without it the transport is DISABLED: the form validates locally and tells the visitor how to reach SIRAJ directly.

export type FormKind = 'contact' | 'interest';

export interface FieldRule { name: string; required: boolean; maxLength: number; pattern?: RegExp; message: string }

const PHONE = /^\+?[0-9\s-]{8,16}$/;            // Omani 8-digit numbers and international formats
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const RULES: Record<FormKind, FieldRule[]> = {
  contact: [
    { name: 'name', required: true, maxLength: 80, message: 'اكتب اسمك لنتمكّن من مخاطبتك.' },
    { name: 'phone', required: true, maxLength: 20, pattern: PHONE, message: 'اكتب رقم هاتف صحيحًا، مثل 9123 4567.' },
    { name: 'email', required: false, maxLength: 120, pattern: EMAIL, message: 'اكتب بريدًا إلكترونيًا صحيحًا، أو اتركه فارغًا.' },
    { name: 'message', required: true, maxLength: 1000, message: 'اكتب رسالتك في سطر أو أكثر.' },
    { name: 'consent', required: true, maxLength: 3, message: 'نحتاج موافقتك لنتواصل معك.' },
  ],
  interest: [
    { name: 'name', required: true, maxLength: 80, message: 'اكتب اسمك لنتمكّن من مخاطبتك.' },
    { name: 'phone', required: true, maxLength: 20, pattern: PHONE, message: 'اكتب رقم هاتف صحيحًا، مثل 9123 4567.' },
    { name: 'interest', required: true, maxLength: 20, message: 'اختر ما تهتمّ به.' },
    { name: 'note', required: false, maxLength: 500, message: 'الملاحظة أطول من المسموح.' },
    { name: 'consent', required: true, maxLength: 3, message: 'نحتاج موافقتك لنتواصل معك.' },
  ],
};

export const INTEREST_OPTIONS = [
  { value: 'apartment', label: 'شقة سكنية' },
  { value: 'shop', label: 'محل تجاري' },
] as const;

/** The JSON body an approved endpoint receives (POST, application/json, no cookies). */
export interface Submission {
  form: FormKind;
  version: 1;
  fields: Record<string, string | boolean>;
  page: string;          // path the form was sent from
  locale: 'ar';
  submittedAt: string;   // ISO-8601
}

export const TRANSPORT = {
  endpoint: (import.meta.env.PUBLIC_SIRAJ_FORMS_ENDPOINT as string | undefined)?.trim() || '',
  get enabled() { return /^https:\/\//.test(this.endpoint); },
  timeoutMs: 15000,
};
