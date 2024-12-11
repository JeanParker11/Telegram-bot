import logging
from telegram.ext import ApplicationBuilder, CommandHandler
from config import TELEGRAM_BOT_TOKEN  # Import du token depuis config.py

# Activation des logs pour faciliter le débogage
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)
logger = logging.getLogger(__name__)

async def start(update, context):
    """Gestion de la commande /start"""
    await update.message.reply_text("Bienvenue !")

def main():
    """Fonction principale pour lancer le bot"""
    bot = ApplicationBuilder().token(TELEGRAM_BOT_TOKEN).build()

    # Ajout du handler pour la commande /start
    bot.add_handler(CommandHandler("start", start))

    # Lancer le bot en mode polling
    bot.run_polling()

if __name__ == "__main__":
    main()
