import { Resend } from 'resend';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContact(request) {
  const body = await request.json();
  if (body.companyWebsite) return { ok: true };
  if (!body.name || !body.email || !emailPattern.test(body.email) || !body.projectType || !body.message || !body.privacy) return { ok: false, status: 400, message: 'Invalid form data' };
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL || !process.env.CONTACT_FROM_EMAIL) return { ok: false, status: 503, message: 'Contact service is not configured' };
  const resend = new Resend(process.env.RESEND_API_KEY);
  const content = `Name: ${body.name}\nUnternehmen: ${body.company || '—'}\nE-Mail: ${body.email}\nTelefon: ${body.phone || '—'}\nProjekt: ${body.projectType}\nAktuelle Website: ${body.website || '—'}\n\n${body.message}`;
  const result = await resend.emails.send({ from: process.env.CONTACT_FROM_EMAIL, to: process.env.CONTACT_TO_EMAIL, replyTo: body.email, subject: `Neue Anfrage von ${body.name}`, text: content, html: `<h2>Neue Projektanfrage</h2><p><strong>Name:</strong> ${escapeHtml(body.name)}</p><p><strong>Unternehmen:</strong> ${escapeHtml(body.company || '—')}</p><p><strong>E-Mail:</strong> ${escapeHtml(body.email)}</p><p><strong>Telefon:</strong> ${escapeHtml(body.phone || '—')}</p><p><strong>Projekt:</strong> ${escapeHtml(body.projectType)}</p><p><strong>Website:</strong> ${escapeHtml(body.website || '—')}</p><hr><p>${escapeHtml(body.message).replace(/\n/g, '<br>')}</p>` });
  return result.error ? { ok: false, status: 502, message: result.error.message } : { ok: true };
}

function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
