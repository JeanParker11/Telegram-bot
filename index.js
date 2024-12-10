const { Telegraf } = require('telegraf');
require('dotenv').config();

// Charger la configuration
const config = require('./config.json');

// Initialiser le bot avec le token
const bot = new Telegraf(process.env.BOT_TOKEN);

// Commande /start
bot.start((ctx) => {
  ctx.reply(
    `👋 Bonjour ${ctx.from.first_name} !\nJe suis ${config.bot_name}, un bot de modération.\nPropriétaire : ${config.owner_name} - Contact : ${config.owner_number}`
  );
});

// Commande /kickall - Supprime tous les membres sauf les administrateurs
bot.command('kickall', async (ctx) => {
  const chatId = ctx.chat.id;

  // Vérifier si l'utilisateur est admin
  const user = await ctx.telegram.getChatMember(chatId, ctx.from.id);
  if (!['administrator', 'creator'].includes(user.status)) {
    return ctx.reply('❌ Vous devez être administrateur pour utiliser cette commande.');
  }

  ctx.reply('🚨 Suppression de tous les membres en cours...');
  const members = await ctx.telegram.getChatAdministrators(chatId);

  // Supprimer tous les membres sauf les admins et le bot
  members.forEach(async (member) => {
    if (['administrator', 'creator'].includes(member.status) || member.user.is_bot) {
      return;
    }
    try {
      await ctx.telegram.kickChatMember(chatId, member.user.id);
    } catch (err) {
      console.error(err);
    }
  });

  ctx.reply('✅ Tous les membres ont été supprimés.');
});

// Kick un membre mentionné
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

// Lancer le bot
bot.launch().then(() => {
  console.log(`${config.bot_name} est actif.`);
});

// Gestion des erreurs
bot.catch((err) => {
  console.error('Erreur :', err);
});
