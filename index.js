const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Commande pour afficher un menu des commandes
bot.start((ctx) => {
  ctx.reply(`
🤖 Bienvenue dans MYSTIC MD MODÈLE PARKY !
Voici les commandes disponibles :
- /kickall : Supprime tous les membres sauf les admins.
- kick @username : Supprime un utilisateur mentionné.
  `);
});

// Commande pour supprimer un membre mentionné
bot.hears(/^kick/i, async (ctx) => {
  const entities = ctx.message.entities;

  if (entities && entities.length > 0) {
    const mention = entities.find((e) => e.type === 'mention');

    if (mention) {
      const username = ctx.message.text.substring(mention.offset + 1, mention.offset + mention.length);

      try {
        // Récupérer les informations du membre via son username
        const chatMember = await ctx.telegram.getChatMember(ctx.chat.id, username);

        // Vérifier si le membre est administrateur ou créateur
        if (['administrator', 'creator'].includes(chatMember.status)) {
          return ctx.reply('❌ Impossible de supprimer un administrateur ou le créateur.');
        }

        // Supprimer le membre
        await ctx.telegram.kickChatMember(ctx.chat.id, chatMember.user.id);
        ctx.reply(`✅ ${chatMember.user.first_name} a été supprimé.`);
      } catch (err) {
        console.error(`Erreur lors de la suppression de ${username}:`, err);
        ctx.reply('❌ Impossible de supprimer cet utilisateur.');
      }
    } else {
      ctx.reply('❌ Mention invalide. Veuillez mentionner un utilisateur à supprimer.');
    }
  } else {
    ctx.reply('❌ Vous devez mentionner un utilisateur avec la commande `kick @username`.');
  }
});

// Commande pour supprimer tous les membres sauf les admins
bot.command('kickall', async (ctx) => {
  const chatId = ctx.chat.id;

  // Vérifier si l'utilisateur est administrateur
  const user = await ctx.telegram.getChatMember(chatId, ctx.from.id);
  if (!['administrator', 'creator'].includes(user.status)) {
    return ctx.reply('❌ Vous devez être administrateur pour utiliser cette commande.');
  }

  ctx.reply('🚨 Suppression de tous les membres en cours...');
  try {
    // Récupérer tous les membres du chat
    const members = await ctx.telegram.getChatAdministrators(chatId);

    // Boucle sur les membres non-admins pour les supprimer
    for (const member of members) {
      if (['administrator', 'creator'].includes(member.status) || member.user.is_bot) continue;

      try {
        await ctx.telegram.kickChatMember(chatId, member.user.id);
        console.log(`✅ Membre supprimé : ${member.user.first_name}`);
      } catch (err) {
        console.error(`❌ Erreur lors de la suppression de ${member.user.first_name}:`, err);
      }
    }

    ctx.reply('✅ Tous les membres ont été supprimés.');
  } catch (err) {
    console.error("Erreur lors de la suppression de tous les membres :", err);
    ctx.reply('❌ Une erreur est survenue pendant la suppression des membres.');
  }
});

// Configuration du webhook
const HOST = process.env.HOST || 'https://telegram-bot-o1rv.onrender.com'; // Remplacez par l'URL de votre app Render
const PATH = `/webhook/${process.env.BOT_TOKEN}`;
const PORT = process.env.PORT || 3000;

bot.telegram.setWebhook(`${HOST}${PATH}`)
  .then(() => {
    console.log(`✅ Webhook configuré sur ${HOST}${PATH}`);
  })
  .catch((err) => {
    console.error('❌ Erreur lors de la configuration du webhook :', err);
  });

bot.startWebhook(PATH, null, PORT);
console.log(`🚀 Bot lancé et écoute sur le port ${PORT}`);

// Gestion des erreurs globales
bot.catch((err, ctx) => {
  console.error(`❌ Une erreur a été capturée : ${err}`);
});
