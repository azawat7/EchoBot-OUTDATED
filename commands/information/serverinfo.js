const { MessageEmbed } = require("discord.js");
const r = require("replacer-js");

module.exports.help = {
  name: "serverinfo",
  aliases: ["si"],
  category: "information",
  expectedArgs: null,
  minArgs: 0,
  maxArgs: 0,
  ownerOnly: false,
  userPerms: [],
  clientPerms: [],
  nsfw: false,
  cooldown: 3,
  example: 1,
  emoji: "π",
};
//

module.exports.run = async (client, message, args, language) => {
  const owner = await message.guild.fetchOwner();
  const filterLevels = {
    DISABLED: language.OFF,
    MEMBERS_WITHOUT_ROLES: language.NOROLE,
    ALL_MEMBERS: language.EVERY,
  };
  const verificationLevels = {
    NONE: language.NONE,
    LOW: language.LOW,
    MEDIUM: language.MEDIUM,
    HIGH: "(β―Β°β‘Β°οΌβ―οΈ΅ β»ββ»",
    VERY_HIGH: "β»ββ» οΎγ½(ΰ² ηΰ² )γε½‘β»ββ»",
  };

  const vanityCode = message.guild.vanityURLCode;
  let vanityInvite = `discord.gg/${vanityCode}`;
  if (vanityCode === null) vanityInvite = language.NOURL;

  let guild = message.guild;
  function checkDays(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days + (days == 1 ? " day" : " days") + ` ${language.DAYSAGO}`;
  }

  let serverembed = new MessageEmbed()
    .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
    .setFooter(
      `${r(language.REQUESTED, {
        "{user}": message.author.tag,
      })}`
    )
    .setColor(client.colors.echo)
    .addFields(
      {
        name: `π« ${language.NAME}`,
        value: `>>> \`${message.guild.name}\``,
        inline: true,
      },
      {
        name: `π ${language.CREATIONDATE}`,
        value: `>>> \`${message.channel.guild.createdAt
          .toUTCString()
          .substr(0, 16)} (${checkDays(message.channel.guild.createdAt)})\``,
        inline: true,
      },
      {
        name: `π₯ ${language.MEMBERS}`,
        value: `>>> \`${message.guild.members.cache.size}\``,
        inline: true,
      },
      {
        name: `π― ${language.TOTALMEMBERS}`,
        value: `>>> \`${
          message.guild.members.cache.filter((member) => !member.user.bot).size
        } ${language.USER} | ${
          message.guild.members.cache.filter((member) => member.user.bot).size
        } ${language.BOT}\``,
        inline: true,
      },
      {
        name: `π ${language.ID}`,
        value: `>>> \`${message.guild.id}\``,
        inline: true,
      },
      {
        name: `π ${language.OWNER}`,
        value: `>>> \`${owner.user.username}#${owner.user.discriminator}\``,
        inline: true,
      },
      {
        name: `βοΈ ${language.VERIFLVL}`,
        value: `>>> \`${verificationLevels[message.guild.verificationLevel]}\``,
        inline: true,
      },
      {
        name: `π ${language.BOOST}`,
        value: `>>> \`${
          message.guild.premiemTier
            ? `${language.TIER} ${message.guild.premiumTier}`
            : language.NONE
        }\``,
        inline: true,
      },
      {
        name: `π¨ ${language.BOOSTS}`,
        value: `>>> \`${message.guild.premiumSubscriptionCount || "0"}\``,
        inline: true,
      },
      {
        name: `π¨ ${language.FILTER}`,
        value: `>>> \`${filterLevels[message.guild.explicitContentFilter]}\``,
        inline: true,
      },
      {
        name: `π¨ ${language.VANITY}`,
        value: `>>> \`${vanityInvite}\``,
        inline: true,
      },
      {
        name: `πΌ ${language.ICON}`,
        value: `>>> [${language.HERE}](${message.guild.iconURL({
          dynamic: true,
        })})`,
        inline: true,
      }
    )
    .addField(
      `π« ${language.EMOJIS}`,
      `
        >>> π¬ ${language.TEXT} \`${
        message.guild.channels.cache.filter(
          (channel) => channel.type === "GUILD_TEXT"
        ).size
      }\`
        π€ ${language.VOICE} \`${
        message.guild.channels.cache.filter(
          (channel) => channel.type === "GUILD_VOICE"
        ).size
      }\`
        π ${language.EMOJI} \`${message.guild.emojis.cache.size}\`
        π» ${language.ANIME} \`${
        message.guild.emojis.cache.filter((emoji) => emoji.animated).size
      }\`
      `,
      true
    )
    .addField(
      `π¨βπ ${language.PRESENCE}`,
      `
        >>> ${client.emoji.online} ${language.ONLINE} \`${
        message.guild.members.cache.filter(
          (member) => member.presence?.status === "online"
        ).size
      }\`
        ${client.emoji.idle} ${language.IDLE} \`${
        message.guild.members.cache.filter(
          (member) => member.presence?.status === "idle"
        ).size
      }\`
        ${client.emoji.dnd} ${language.DND} \`${
        message.guild.members.cache.filter(
          (member) => member.presence?.status === "dnd"
        ).size
      }\`
        ${client.emoji.offline} ${language.OFFLINE} \`${
        message.guild.members.cache.filter(
          (member) => member.presence?.status === "offline"
        ).size
      }\`
      `,
      true
    );

  message.channel.send({ embeds: [serverembed] });
};
