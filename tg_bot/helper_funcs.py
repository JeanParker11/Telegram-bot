from telegram import Chat, User

def bot_admin(func):
    def wrapper(update, context, *args, **kwargs):
        chat = update.effective_chat
        bot = context.bot
        bot_member = chat.get_member(bot.id)

        if not bot_member.can_restrict_members:
            update.message.reply_text("Je dois être admin avec les permissions nécessaires pour faire cela.")
            return

        return func(update, context, *args, **kwargs)
    return wrapper

def user_admin(func):
    def wrapper(update, context, *args, **kwargs):
        user = update.effective_user
        chat = update.effective_chat
        if not chat.get_member(user.id).status in ['administrator', 'creator']:
            update.message.reply_text("Seuls les admins peuvent utiliser cette commande.")
            return

        return func(update, context, *args, **kwargs)
    return wrapper

def can_restrict(func):
    def wrapper(update, context, *args, **kwargs):
        chat = update.effective_chat
        bot = context.bot
        if not chat.get_member(bot.id).can_restrict_members:
            update.message.reply_text("Je n'ai pas la permission de restreindre des membres.")
            return

        return func(update, context, *args, **kwargs)
    return wrapper

def is_user_admin(chat: Chat, user_id: int):
    return chat.get_member(user_id).status in ['administrator', 'creator']
