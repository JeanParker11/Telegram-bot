import os
from flask import Flask
from telegram import Update, Bot
from telegram.constants import ParseMode
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from threading import Thread

# Initialisation de Flask
app = Flask(__name__)

@app.route('/')
def home():
    return "Bot Telegram est en cours d'exécution."

# Fonction pour démarrer le serveur Flask
def run_flask():
    port = int(os.getenv("PORT", 5000))  # Render attribue un port via la variable PORT
    app.run(host="0.0.0.0", port=port)

# Commande /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "Welcome to the bot!", parse_mode=ParseMode.HTML
    )

if __name__ == "__main__":
    # Récupération du token Telegram depuis les variables d'environnement
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        raise ValueError("Le token du bot est manquant. Ajoutez-le en tant que variable d'environnement.")
    
    # Initialisation du bot Telegram
    bot = ApplicationBuilder().token(token).build()
    
    # Ajout des handlers
    bot.add_handler(CommandHandler("start", start))

    # Lancement du serveur Flask dans un thread séparé
    flask_thread = Thread(target=run_flask)
    flask_thread.start()

    # Lancement du bot Telegram
    bot.run_polling()
