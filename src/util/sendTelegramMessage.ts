const sendTelegramMessage = async (message: string) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Error sending message: ${response.statusText}, ${JSON.stringify(data)}`,
      );
    }

    console.log("Message sent successfully.");
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
};

export default sendTelegramMessage;
