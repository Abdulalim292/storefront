export type InquiryItem = {
  id: string;
  name: string;
  quantity: number;
};

export type Inquiry = {
  name: string;
  phone: string;
  email: string | null;
  equipmentModel: string | null;
  message: string;
  items: InquiryItem[];
  source: 'contact' | 'cart';
  createdAt: string;
};

function supabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export function notificationText(inquiry: Inquiry) {
  const lines = [
    'New storefront inquiry',
    '',
    `Name: ${inquiry.name}`,
    `Phone: ${inquiry.phone}`,
    `Email: ${inquiry.email || 'Not provided'}`,
    `Equipment model: ${inquiry.equipmentModel || 'Not provided'}`,
    `Source: ${inquiry.source === 'cart' ? 'Inquiry list' : 'Contact form'}`,
  ];

  if (inquiry.items.length) {
    lines.push('', 'Items:');
    for (const item of inquiry.items) {
      lines.push(`- ${item.quantity} × ${item.name} (${item.id})`);
    }
  }

  lines.push('', 'Message:', inquiry.message);
  return lines.join('\n');
}

// Store the lead in Supabase with the server-only service role key. The table
// has RLS enabled and no public policies, so only this server path can write.
export async function saveInquiry(inquiry: Inquiry): Promise<boolean> {
  const config = supabaseConfig();
  if (!config) return false;

  try {
    const response = await fetch(`${config.url}/rest/v1/inquiries`, {
      method: 'POST',
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name: inquiry.name,
        phone: inquiry.phone,
        email: inquiry.email,
        equipment_model: inquiry.equipmentModel,
        message: inquiry.message,
        items: inquiry.items,
        source: inquiry.source,
        status: 'new',
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) {
      // Do not log the response body: it can echo submitted personal details.
      console.error('Inquiry storage failed with status', response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Inquiry storage request failed:', error instanceof Error ? error.name : 'unknown error');
    return false;
  }
}

export async function notifyInquiry(inquiry: Inquiry): Promise<boolean> {
  const url = process.env.INQUIRY_WEBHOOK_URL?.trim();
  if (!url) return false;

  const text = notificationText(inquiry);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // `text` works with Slack-style hooks and `content` with Discord.
        text,
        content: text,
        inquiry,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) {
      console.error('Inquiry webhook failed with status', response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Inquiry webhook request failed:', error instanceof Error ? error.name : 'unknown error');
    return false;
  }
}
