require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

// Bot erstellen
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 📅 HIER DEIN EVENT DATUM
const eventDate = new Date("2026-08-09");

// 🔢 Tage berechnen
function getDaysLeft() {
  const now = new Date();
  
  // Wichtig: Zeit auf 00:00 setzen (sonst falsche Tage)
  now.setHours(0,0,0,0);
  
  const diffTime = eventDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// 📩 Nachricht senden
async function sendCountdown() {
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    
    const days = getDaysLeft();

    let message;

    if (days > 1) {
      message = `⏳ Only ${days} days left until release!`;
    } else if (days === 1) {
      message = `🔥 The release is tomorrow!`;
    } else if (days === 0) {
      message = `🎉 The release is today!!!`;
    } else {
      message = `✅ The release is over.`;
    }

    await channel.send(message);
    console.log("✅ Nachricht gesendet:", message);

  } catch (err) {
    console.error("❌ Fehler:", err);
  }
}

// Wenn Bot bereit ist
client.once('ready', () => {
  console.log(`🤖 Eingeloggt als ${client.user.tag}`);

  // ⏰ Täglich um 9:00
  cron.schedule('0 9 * * *', () => {
    console.log("⏰ Countdown wird gesendet...");
    sendCountdown();
  });

  // Optional: direkt beim Start testen
  sendCountdown();
});

// Login
client.login(process.env.TOKEN);