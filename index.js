// Importation des modules nécessaires
const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

// Charger la configuration
const config = {
  bot_name: "MYSTIC MD MODÈLE PARKY",
  owner_name: "Jean Parker",
  owner_number: "+22898133388",
};

// Initialiser le bot avec le token
if (!process.env.BOT_TOKEN) {
  console.error("❌ Erreur : Le token du bot est manquant. Assurez-vous que BOT_TOKEN est défini dans le fichier .env.");
  process.exit(1);
}
const bot = new Telegraf(process.env.BOT_TOKEN);

// Définir l'URL du webhook et le port
const HOST = process.env.HOST || 'https://telegram-bot-o1rv.onrender.com'; // Remplacez par l'URL de votre application Render
const PATH = `/webhook/${process.env.BOT_TOKEN}`;
const PORT = process.env.PORT || 3000;

// Menu principal
const mainMenu = Markup.inlineKeyboard([
  [Markup.button.callback('🔄 Kick All Members', 'kick_all')],
  [Markup.button.callback('🔎 Aide', 'help')],
  [Markup.button.callback('📞 Contact Owner', 'contact_owner')],
]);

// Commande /start
bot.start((ctx) => {
  ctx.reply(
    `👋 Bonjour ${ctx.from.first_name} !\nJe suis ${config.bot_name}, un bot de modération pour les groupes.\n\nPropriétaire : ${config.owner_name}\nContact : ${config.owner_number}`,
    mainMenu
  );
});

// Commande pour afficher le menu
bot.command('menu', (ctx) => {
  ctx.reply('🛠️ Voici les commandes disponibles :', mainMenu);
});

// Action : Kick All Members
bot.action('kick_all', async (ctx) => {
  const chatId = ctx.chat.id;

  // Vérifier si l'utilisateur est administrateur
  const user = await ctx.telegram.getChatMember(chatId, ctx.from.id);
  if (!['administrator', 'creator'].includes(user.status)) {
    return ctx.reply('❌ Vous devez être administrateur pour utiliser cette commande.');
  }

  ctx.reply('🚨 Suppression de tous les membres en cours...');
  try {
    const members = await ctx.telegram.getChatMembersCount(chatId);

    // Récupérer et supprimer les membres
    for (let i = 0; i < members; i++) {
      const member = await ctx.telegram.getChatMember(chatId, i);
      if (['administrator', 'creator'].includes(member.status) || member.user.is_bot) continue;

      await ctx.telegram.kickChatMember(chatId, member.user.id);
    }
    ctx.reply('✅ Tous les membres ont été supprimés.');
  } catch (err) {
    console.error(err);
    ctx.reply('❌ Une erreur est survenue pendant la suppression des membres.');
  }
});

// Action : Aide
bot.action('help', (ctx) => {
  ctx.reply(
    `🔧 Commandes disponibles :\n\n` +
      `/start - Démarrer le bot\n` +
      `/menu - Afficher ce menu\n` +
      `kick [mention] - Supprimer un membre mentionné\n` +
      `/kickall - Supprimer tous les membres sauf les administrateurs\n\n` +
      `📞 Contact propriétaire : ${config.owner_name} (${config.owner_number})`
  );
});

// Action : Contact Owner
bot.action('contact_owner', (ctx) => {
  ctx.reply(
    `📞 Contactez ${config.owner_name} via WhatsApp : ${config.owner_number}\nOu posez vos questions ici.`
  );
});

// Gérer les messages "kick @username"
bot.on('message', async (ctx) => {
  const message = ctx.message;

  if (message.text && message.text.toLowerCase().startsWith('kick')) {
    const entities = message.entities;
    if (entities && entities[0].type === 'mention') {
      const username = message.text.substring(entities[0].offset, entities[0].length).trim();

      try {
        const target = await ctx.telegram.getChatMember(ctx.chat.id, username);
        await ctx.telegram.kickChatMember(ctx.chat.id, target.user.id);
        ctx.reply(`✅ ${target.user.first_name} a été supprimé.`);
      } catch (err) {
        console.error(err);
        ctx.reply('❌ Impossible de supprimer cet utilisateur.');
      }
    } else {
      ctx.reply('❌ Veuillez mentionner un utilisateur à supprimer.');
    }
  }
});

// Configurer et démarrer le webhook
bot.telegram.setWebhook(`${HOST}${PATH}`)
  .then(() => {
    console.log(`✅ Webhook configuré sur ${HOST}${PATH}`);
  })
  .catch((err) => {
    console.error('❌ Erreur lors de la configuration du webhook :', err);
  });

bot.startWebhook(PATH, null, PORT);
console.log(`🚀 Bot lancé et écoute sur le port ${PORT}`);

// Gérer les erreurs globales
bot.catch((err) => {
  console.error('❌ Erreur capturée par le bot :', err);
});
