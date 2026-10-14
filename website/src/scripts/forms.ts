// SIRAJ website — form behaviour: blur-first validation (errors clear as soon as the value is fixed), focus on the
// first invalid field, honeypot, and a transport that sends nothing unless an approved endpoint is configured.
import { RULES, TRANSPORT, type FormKind, type Submission } from '../forms/contract';

function fieldOf(form: HTMLFormElement, name: string) {
  return form.querySelector<HTMLElement>(`[data-field="${name}"]`);
}

function validate(form: HTMLFormElement, kind: FormKind, name: string): boolean {
  const rule = RULES[kind].find((r) => r.name === name);
  const box = fieldOf(form, name);
  const input = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
  if (!rule || !box || !input) return true;
  let ok = true;
  if (input instanceof HTMLInputElement && input.type === 'checkbox') ok = !rule.required || input.checked;
  else {
    const v = input.value.trim();
    if (rule.required && !v) ok = false;
    if (ok && v && rule.pattern && !rule.pattern.test(v)) ok = false;
    if (ok && v.length > rule.maxLength) ok = false;
  }
  box.classList.toggle('is-invalid', !ok);
  input.setAttribute('aria-invalid', ok ? 'false' : 'true');
  return ok;
}

function show(form: HTMLFormElement, state: 'success' | 'offline' | 'error' | null) {
  const status = form.querySelector<HTMLElement>('.sj-form-status');
  if (!status) return;
  status.hidden = !state;
  status.querySelectorAll<HTMLElement>('[data-state]').forEach((el) => { el.hidden = el.dataset.state !== state; });
  if (state) status.focus({ preventScroll: false });
}

async function send(body: Submission): Promise<boolean> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TRANSPORT.timeoutMs);
  try {
    const res = await fetch(TRANSPORT.endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body), credentials: 'omit', mode: 'cors', signal: ctrl.signal,
    });
    return res.ok;
  } catch { return false; } finally { clearTimeout(t); }
}

export function initForms(root: ParentNode = document) {
  root.querySelectorAll<HTMLFormElement>('form[data-sj-form]').forEach((form) => {
    const kind = form.dataset.sjForm as FormKind;
    const names = RULES[kind].map((r) => r.name);
    names.forEach((name) => {
      const input = form.elements.namedItem(name) as HTMLElement | null;
      if (!input) return;
      input.addEventListener('blur', () => validate(form, kind, name));
      input.addEventListener('input', () => { if (fieldOf(form, name)?.classList.contains('is-invalid')) validate(form, kind, name); });
      input.addEventListener('change', () => { if (fieldOf(form, name)?.classList.contains('is-invalid')) validate(form, kind, name); });
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      show(form, null);
      const results = names.map((n) => validate(form, kind, n));
      const firstBad = names[results.indexOf(false)];
      if (firstBad) { (form.elements.namedItem(firstBad) as HTMLElement | null)?.focus(); return; }
      const hp = form.elements.namedItem('company') as HTMLInputElement | null;
      if (hp && hp.value) { show(form, 'success'); return; }               // bot: pretend success, send nothing
      if (!TRANSPORT.enabled) { show(form, 'offline'); return; }           // transport disabled: nothing leaves the browser
      const fields: Record<string, string | boolean> = {};
      names.forEach((n) => {
        const el = form.elements.namedItem(n) as HTMLInputElement | null;
        if (!el) return;
        fields[n] = el.type === 'checkbox' ? el.checked : el.value.trim();
      });
      const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      btn?.setAttribute('aria-busy', 'true'); if (btn) btn.disabled = true;
      const ok = await send({ form: kind, version: 1, fields, page: location.pathname, locale: 'ar', submittedAt: new Date().toISOString() });
      btn?.removeAttribute('aria-busy'); if (btn) btn.disabled = false;
      if (ok) { form.reset(); show(form, 'success'); } else show(form, 'error');
    });
  });
}
