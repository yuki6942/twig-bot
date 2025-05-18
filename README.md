# 🌿 Twig – Discord Bot for Better Than Adventure Server

Twig is a custom Discord bot built to manage whitelist requests and server status for the Better Than Adventure (BTA) Minecraft server hosted at `beta.yuki6942.de`.  
It helps streamline access for new players and keeps the community informed about server availability.

---

## ✨ Features

- ✅ **Whitelist Requests:**  
  Allow users to submit their Minecraft username via a simple command.
- 📋 **Whitelist Status:**  
  Check whether the whitelist is currently open or closed.

- 🌐 **Server Info:**  
  Display server IP and location.

- 🛡️ **Admin Notifications:**  
  Automatically send whitelist requests to a designated admin channel for review.

---

## 💻 Commands

### `/whitelist request <username>`

Submit a request to be added to the server whitelist.

> 📝 Whitelist requests are subject to manual approval. Not all requests will be accepted immediately.

---

### `/whitelist status`

Check whether the server is currently accepting new whitelist requests.

---

## 🔧 Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yuki6942/twig-bot.git
   cd twig-bot
   npm i
   npm run start
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a data/config.json file
   Add your bot token and config:
   ```bash
   {
    "token": "YOUR_DISCORD_TOKEN",
    "mongo_uri": "YOUR_MONGODB_URI",
    "guildId": "YOUR_GUILDID",
    "adminChannelId": "YOUR_ADMINCHANNELID",
    "discordClientId": "YOUR_BOTID"
   }
   ```
4. Start the bot

   ```bash
   npm run start

   ```

## 📝 License

This project is licensed under the [MIT License](https://raw.githubusercontent.com/yuki6942/twig-bot/main/LICENSE).
Feel free to fork, extend, and adapt it to your own server needs!

## 💬 Support & Contact

Got questions or suggestions?
Join our [Discord server](https://discord.gg/ktdKDHqqfM)
