from telegram import Update, ParseMode
from telegram.ext import CallbackContext

# Nom et numéro du propriétaire
BOT_OWNER_NAME = "Votre Nom"
BOT_OWNER_NUMBER = "+22898133388"
BOT_NAME = "VotreBot"

# Commande pour afficher le menu
def menu(update: Update, context: CallbackContext):
    menu_text = f"""
*Menu des Commandes de {BOT_NAME}:*
- `/menu` : Affiche ce menu.
- `/kick <@username>` : Exclure un utilisateur spécifique.
- `/kickall` : Exclure tous les membres sauf les admins.
- `/support` : Contactez le propriétaire du bot.
"""
    update.message.reply_text(menu_text, parse_mode=ParseMode.MARKDOWN)

# Commande pour afficher les informations de support
def support(update: Update, context: CallbackContext):
    support_text = f"""
*Support du Bot:*
- Propriétaire : {BOT_OWNER_NAME}
- Numéro : {BOT_OWNER_NUMBER}
"""
    update.message.reply_text(support_text, parse_mode=ParseMode.MARKDOWN)
