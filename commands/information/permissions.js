const { Permissions } = require("discord.js");
const permissions = Object.keys(Permissions.FLAGS);
const r = require("replacer-js");

module.exports.help = {
  name: "permissions",
  aliases: ["permission", "perms"],
  category: "information",
  expectedArgs: "`[@user]`",
  minArgs: 0,
  maxArgs: 1,
  ownerOnly: false,
  userPerms: [],
  clientPerms: [],
  nsfw: false,
  cooldown: 3,
  example: 2,
  emoji: "📜",
};

module.exports.run = async (client, message, args, language) => {
  const member = message.mentions.members.first() || message.member;
  let text = `\`\`\`${r(language.TEXT, {
    "{user}": member.user.username,
    "{channel}": message.channel.name,
  })}\n\n`;
  const mPermissions = message.channel.permissionsFor(member);
  const total = {
    denied: 0,
    allowed: 0,
  };
  permissions.forEach((perm) => {
    if (!mPermissions.has(perm)) {
      text += `${perm} ❌\n`;
      total.denied++;
    } else {
      text += `${perm} ✅\n`;
      total.allowed++;
    }
  });
  text += `\n${total.allowed} ✅ | ${total.denied} ❌` + "\n```";
  message.channel.send({ content: text });
};
