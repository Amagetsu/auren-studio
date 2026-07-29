import { Resend } from 'resend';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fields = { name: 120, email: 254, phone: 40, company: 160, projectType: 120, website: 500, message: 5000 };

export async function sendContact(request) {
  let body;
  try { body = await request.json(); } catch { return { ok: false, status: 400, message: 'Invalid JSON' }; }
  if (!body || typeof body !== 'object') return { ok: false, status: 400, message: 'Invalid form data' };
  if (String(body.companyWebsite || '').trim()) return { ok: true };
  const values = Object.fromEntries(Object.entries(fields).map(([key]) => [key, typeof body[key] === 'string' ? body[key].trim() : '']));
  if (!values.name || !values.email || !emailPattern.test(values.email) || !values.projectType || !values.message || body.privacy !== 'on' || Object.entries(fields).some(([key, max]) => values[key].length > max)) return { ok: false, status: 400, message: 'Invalid form data' };
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL || !process.env.CONTACT_FROM_EMAIL) return { ok: false, status: 503, message: 'Contact service is not configured' };
  const resend = new Resend(process.env.RESEND_API_KEY);
  const content = `Name: ${values.name}\nUnternehmen: ${values.company || '—'}\nE-Mail: ${values.email}\nTelefon: ${values.phone || '—'}\nProjekt: ${values.projectType}\nAktuelle Website: ${values.website || '—'}\n\n${values.message}`;
  const result = await resend.emails.send({ from: process.env.CONTACT_FROM_EMAIL, to: process.env.CONTACT_TO_EMAIL, replyTo: values.email, subject: `Neue Anfrage von ${values.name}`, text: content, html: `<h2>Neue Projektanfrage</h2><p><strong>Name:</strong> ${escapeHtml(values.name)}</p><p><strong>Unternehmen:</strong> ${escapeHtml(values.company || '—')}</p><p><strong>E-Mail:</strong> ${escapeHtml(values.email)}</p><p><strong>Telefon:</strong> ${escapeHtml(values.phone || '—')}</p><p><strong>Projekt:</strong> ${escapeHtml(values.projectType)}</p><p><strong>Website:</strong> ${escapeHtml(values.website || '—')}</p><hr><p>${escapeHtml(values.message).replace(/\n/g, '<br>')}</p>` });
  return result.error ? { ok: false, status: 502, message: result.error.message } : { ok: true };
}

function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
