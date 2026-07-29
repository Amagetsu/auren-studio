import { sendContact } from '../server/contact.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ ok: false, message: 'Method not allowed' });
    return;
  }

  try {
    const result = await sendContact({ json: async () => request.body });
    response.status(result.status || 200).json(result);
  } catch {
    response.status(500).json({ ok: false, message: 'Unexpected server error' });
  }
}
