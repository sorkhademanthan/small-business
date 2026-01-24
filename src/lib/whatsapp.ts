/**
 * Utility to send WhatsApp Template Messages via Meta Graph API
 */

interface TemplateComponent {
  type: string;
  parameters?: Array<{
    type: string;
    text?: string;
  }>;
}

export async function sendWhatsAppMessage(
  to: string,
  templateName: string,
  components: TemplateComponent[] = []
) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.error("Missing WhatsApp Environment Variables");
    return { success: false, error: "Configuration Error" };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to,
          type: "template",
          template: {
            name: templateName,
            language: { code: "en_US" },
            components: components,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
        console.error("WhatsApp API Error:", JSON.stringify(data, null, 2));
        return { success: false, error: data };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Network Error sending WhatsApp:", error);
    return { success: false, error };
  }
}
