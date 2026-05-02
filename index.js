require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');
const express = require('express');

const app = express();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const eventDate = new Date("2026-08-09");

function getDaysLeft() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const diffTime = eventDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

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

client.once('clientReady', () => {
  console.log(`🤖 Eingeloggt als ${client.user.tag}`);

  cron.schedule('0 9 * * *', () => {
    console.log("⏰ Countdown wird gesendet...");
    sendCountdown();
  });

  sendCountdown();
});

client.login(process.env.TOKEN);

app.get('/', (req, res) => {
  res.send('Bot is running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 Webserver läuft auf Port ${PORT}`);
});