import os
import logging
from telegram import Update, Bot, ParseMode
from telegram.ext import Updater, CommandHandler, CallbackContext, run_async
from telegram.error import BadRequest
from telegram.utils.helpers import mention_html

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
LOGGER = logging.getLogger(__name__)

# Load the bot token from environment variables
TOKEN = os.getenv("BOT_TOKEN")

if not TOKEN:
    LOGGER.error("BOT_TOKEN environment variable is missing!")
    exit(1)

# Initialize the bot
bot = Bot(TOKEN)

### Command Handlers ###
@run_async
def start(update: Update, context: CallbackContext):
    """Send a welcome message and show commands."""
    user = update.effective_user
    bot_info = context.bot.get_me()
    owner_name = os.getenv("OWNER_NAME", "Admin")
    owner_contact = os.getenv("OWNER_CONTACT", "Not available")
    
    message = f"""
    👋 Hello {mention_html(user.id, user.first_name)}, welcome to <b>{bot_info.first_name}</b>!

    🤖 <b>Bot Commands:</b>
    - /start: Show this message.
    - /kickall: Remove all members except admins.
    - /owner: Get owner information.

    🔧 <b>Owner Info:</b>
    - Name: {owner_name}
    - Contact: {owner_contact}
    """
    update.message.reply_text(message, parse_mode=ParseMode.HTML)

@run_async
def owner(update: Update, context: CallbackContext):
    """Send the owner's contact information."""
    owner_name = os.getenv("OWNER_NAME", "Admin")
    owner_contact = os.getenv("OWNER_CONTACT", "Not available")
    update.message.reply_text(
        f"📞 <b>Owner Info:</b>\n- Name: {owner_name}\n- Contact: {owner_contact}",
        parse_mode=ParseMode.HTML
    )

@run_async
def kickall(update: Update, context: CallbackContext):
    """Kick all members except admins."""
    chat = update.effective_chat
    bot_member = chat.get_member(bot.id)
    
    if not bot_member.can_restrict_members:
        update.message.reply_text("I don't have permission to kick members!")
        return

    kicked_count = 0
    for member in chat.get_members():
        try:
            if not member.user.is_bot and not member.status in ["administrator", "creator"]:
                chat.kick_member(member.user.id)
                kicked_count += 1
        except BadRequest as e:
            LOGGER.warning(f"Could not kick {member.user.id}: {e}")

    update.message.reply_text(f"✅ Successfully kicked {kicked_count} members.")

@run_async
def help_command(update: Update, context: CallbackContext):
    """Show help information."""
    message = """
    🤖 <b>Available Commands:</b>
    - /start: Show bot information.
    - /kickall: Remove all members except admins.
    - /owner: Get owner information.
    """
    update.message.reply_text(message, parse_mode=ParseMode.HTML)

### Main Function ###
def main():
    """Start the bot."""
    updater = Updater(TOKEN, use_context=True)
    dispatcher = updater.dispatcher

    # Register command handlers
    dispatcher.add_handler(CommandHandler("start", start))
    dispatcher.add_handler(CommandHandler("owner", owner))
    dispatcher.add_handler(CommandHandler("kickall", kickall))
    dispatcher.add_handler(CommandHandler("help", help_command))

    # Start the bot
    LOGGER.info("Bot is starting...")
    updater.start_polling()
    updater.idle()

if __name__ == "__main__":
    main()
