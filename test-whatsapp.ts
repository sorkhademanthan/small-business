import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function sendTestMessage() {
  console.log("🚀 Attempting to send test message...");

  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  // Your verified phone number (from your screenshot)
  const recipientNumber = "918454898626";

  if (!token || !phoneNumberId) {
    console.log("❌ Missing environment variables!");
    console.log("Token exists:", !!token);
    console.log("Phone Number ID:", phoneNumberId);
    return;
  }

  console.log("📱 Sending to:", recipientNumber);
  console.log("📞 Using Phone ID:", phoneNumberId);

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
          to: recipientNumber,
          type: "template",
          template: {
            name: "hello_world",
            language: { code: "en_US" },
          },
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("\n✅ SUCCESS! Check your WhatsApp now.");
      console.log("Response:", JSON.stringify(data, null, 2));
    } else {
      console.log("\n❌ FAILED!");
      console.log("Error:", JSON.stringify(data, null, 2));
      
      if (data.error?.code === 190) {
        console.log("\n⚠️ TIP: Your access token has expired. Generate a new one from Meta Dashboard.");
      } else if (data.error?.code === 133010) {
        console.log("\n⚠️ TIP: Your phone number is not verified. Add it to the 'To' list in Meta Dashboard and verify with OTP.");
      }
    }
  } catch (error) {
    console.log("❌ Network Error:", error);
  }
}

sendTestMessage();
