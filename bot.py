import os
import asyncio
from flask import Flask
from telegram import Update, ParseMode
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from aiohttp import web

# Initialisation de Flask
app = Flask(__name__)

@app.route('/')
def home():
    return "Bot Telegram est en cours d'exécution."

# Fonction pour démarrer le serveur Flask avec Aiohttp
async def run_flask():
    port = int(os.getenv("PORT", 5000))  # Render attribue un port via la variable PORT
    app.run(host="0.0.0.0", port=port)

# Commande /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "Welcome to the bot!", parse_mode=ParseMode.HTML
    )

async def main():
    # Récupération du token Telegram depuis les variables d'environnement
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        raise ValueError("Le token du bot est manquant. Ajoutez-le en tant que variable d'environnement.")
    
    # Initialisation du bot Telegram
    bot = ApplicationBuilder().token(token).build()
    
    # Ajout des handlers
    bot.add_handler(CommandHandler("start", start))

    # Lancement du bot Telegram
    await bot.run_polling()

if __name__ == "__main__":
    # Exécution asynchrone de Flask et Telegram
    loop = asyncio.get_event_loop()
    
    # Lancer Flask dans une tâche asyncio
    loop.create_task(run_flask())

    # Lancer Telegram
    loop.run_until_complete(main())
