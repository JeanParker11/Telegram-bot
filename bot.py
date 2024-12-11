import logging
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters
from tg_bot.modules.kick_module import kick, kickall
from tg_bot.modules.info_module import menu, support

# Configure le journal
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
LOGGER = logging.getLogger(__name__)

# Votre token Telegram ici
TOKEN = "VOTRE_BOT_TOKEN"

def main():
    updater = Updater(token=TOKEN, use_context=True)
    dispatcher = updater.dispatcher

    # Gestionnaires de commandes
    dispatcher.add_handler(CommandHandler("menu", menu))
    dispatcher.add_handler(CommandHandler("support", support))
    dispatcher.add_handler(CommandHandler("kick", kick, pass_args=True, filters=Filters.group))
    dispatcher.add_handler(CommandHandler("kickall", kickall, filters=Filters.group))

    # Lance le bot
    updater.start_polling()
    updater.idle()

if __name__ == "__main__":
    main()
