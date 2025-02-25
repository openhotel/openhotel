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

export const getRandomDiscordMessage = (
  username: string,
  totalGuests: number,
) => {
  const openings = [
    `🔑 Someone just picked up their room key...`,
    `🛎️ A new guest has arrived at the front desk!`,
    `🚪 A door just opened in the hallway...`,
    `🏨 The hotel lobby just got a little busier!`,
    `📦 A fresh check-in just happened!`,
  ];

  const arrivals = [
    `**${username}** has checked in.`,
    `Welcome **${username}** to the hotel!`,
    `Looks like **${username}** found their way inside.`,
    `**${username}** just grabbed their key and stepped in.`,
    `The guest list grows... **${username}** has joined!`,
  ];

  const totals = [
    `We are now **${totalGuests}** guests in the hotel.`,
    `That brings us to **${totalGuests}** guests now.`,
    `We’re now at **${totalGuests}** guests in the hotel.`,
    `That makes **${totalGuests}** guests roaming the halls.`,
    `The hotel population just hit **${totalGuests}**.`,
  ];

  const remarks = [
    `Hope they don’t get lost on the way to their room. 🔍😂`,
    `Wonder if they’re here to socialize or just chill. 🤔`,
    `Who will be their first neighbor?  🏡`,
    `Let’s see if they’re a lounge regular or a mystery guest. 🛋️`,
    `Hopefully, they don’t order 50 pillows from room service. 🛏️😂`,
  ];

  const invites = [
    `🔑 Come meet them: [Hotel](https://client.openhotel.club)`,
    `🚪 Say hello: [Hotel](https://client.openhotel.club)`,
    `🎉 Join the fun: [Hotel](https://client.openhotel.club)`,
    `👀 See who’s around: [Hotel](https://client.openhotel.club)`,
    `🏨 Step inside: [Hotel](https://client.openhotel.club)`,
  ];

  const opening = openings[Math.floor(Math.random() * openings.length)];
  const arrival = arrivals[Math.floor(Math.random() * arrivals.length)];
  const total = totals[Math.floor(Math.random() * totals.length)];
  const remark = remarks[Math.floor(Math.random() * remarks.length)];
  const invite = invites[Math.floor(Math.random() * invites.length)];

  const message = `${opening}\n\n${arrival} ${total}\n ${remark}\n\n${invite}\n`;

  return message;
};
