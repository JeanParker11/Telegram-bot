const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

// Charger la configuration
const config = {
  bot_name: "MYSTIC MD MODÈLE PARKY",
  owner_name: "Jean Parker",
  owner_number: "+22898133388",
};

// Initialiser le bot avec le token
const bot = new Telegraf(process.env.BOT_TOKEN);

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

// Commande pour afficher les commandes
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
  const members = await ctx.telegram.getChatMembersCount(chatId);

  // Récupérer et supprimer les membres
  for (let i = 0; i < members; i++) {
    try {
      const member = await ctx.telegram.getChatMember(chatId, i);
      if (['administrator', 'creator'].includes(member.status) || member.user.is_bot) continue;

      await ctx.telegram.kickChatMember(chatId, member.user.id);
    } catch (err) {
      console.error(err);
    }
  }
  ctx.reply('✅ Tous les membres ont été supprimés.');
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

// Démarrer le bot
bot.launch().then(() => {
  console.log(`${config.bot_name} est actif.`);
});

// Gérer les erreurs
bot.catch((err) => {
  console.error('Erreur :', err);
});
