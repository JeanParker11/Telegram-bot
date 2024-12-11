from telegram import Bot, Update
from telegram.ext import CallbackContext
from telegram.error import BadRequest
from tg_bot.modules.helper_funcs.chat_status import bot_admin, user_admin, can_restrict, is_user_admin

# Commande pour kicker un utilisateur
@bot_admin
@can_restrict
@user_admin
def kick(update: Update, context: CallbackContext):
    chat = update.effective_chat
    user = update.effective_user
    message = update.effective_message

    if not context.args:
        message.reply_text("Veuillez mentionner l'utilisateur à exclure.")
        return

    user_id = context.args[0].replace("@", "")
    try:
        chat.kick_member(user_id)
        message.reply_text(f"L'utilisateur @{user_id} a été exclu.")
    except BadRequest as e:
        message.reply_text(f"Erreur: {str(e)}")

# Commande pour kicker tous les membres sauf les admins
@bot_admin
@can_restrict
@user_admin
def kickall(update: Update, context: CallbackContext):
    chat = update.effective_chat
    members = chat.get_members()

    kicked_count = 0
    for member in members:
        if not is_user_admin(chat, member.user.id) and not member.user.is_bot:
            try:
                chat.kick_member(member.user.id)
                kicked_count += 1
            except BadRequest:
                continue

    update.message.reply_text(f"{kicked_count} membres ont été expulsés.")
