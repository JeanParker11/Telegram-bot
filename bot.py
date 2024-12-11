from telegram import Update, Bot
from telegram.constants import ParseMode
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "Welcome to the bot!", parse_mode=ParseMode.HTML
    )

if __name__ == "__main__":
    bot = ApplicationBuilder().token("7980784324:AAEarKtWMUuYCUHLDCH-6kHDQmd_6MaRSZ0").build()

    bot.add_handler(CommandHandler("start", start))

    bot.run_polling()
