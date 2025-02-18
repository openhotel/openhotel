import { System } from "modules/system/main.ts";

export const discordNotify = async (payload: unknown) => {
  const webhookUrl = System.getConfig().notifications.discord;
  if (!webhookUrl) return;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to send Discord notification:", errorText);
    }
  } catch (error) {
    console.error("Discord connection error:", error);
  }
};
