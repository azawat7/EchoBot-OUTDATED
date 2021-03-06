const { Guild } = require("../models/index");
const {
  MessageButton,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
} = require("discord.js");

module.exports = async (client, interaction) => {
  const settings = await client.getGuild(interaction.guild);
  const interactionLan = require(`../languages/${settings.language}/events`);
  if (!settings) return;

  ///////////////////////////////////////////
  //           Button Handling             //
  ///////////////////////////////////////////
  if (interaction.isButton()) {
    const id = interaction.customId;
    ///////////////////////////////////////////
    //          Giveaway Buttons
    const reroll = new MessageButton()
      .setLabel("Reroll")
      .setCustomId(`giveaways-reroll-${interaction.user.id}`)
      .setStyle("PRIMARY");
    const end = new MessageButton()
      .setLabel("End")
      .setStyle("SECONDARY")
      .setCustomId(`giveawayse-end-${interaction.user.id}`)
      .setDisabled(true);
    const enter = new MessageButton()
      .setLabel("Enter")
      .setStyle("SECONDARY")
      .setCustomId(`giveawayse-enter-${interaction.user.id}`)
      .setDisabled(true);
    const rerolldd = new MessageButton()
      .setLabel("Reroll")
      .setCustomId(`giveawaysdd-reroll-${interaction.user.id}`)
      .setStyle("SECONDARY")
      .setDisabled(true);
    const buttons = new MessageActionRow().addComponents([enter, end, reroll]);
    const errbuttons = new MessageActionRow().addComponents([
      enter,
      end,
      rerolldd,
    ]);
    if (id.startsWith("giveaways")) {
      const tag = id.split("-");
      if (tag[1] === "enter") {
        const data = settings.giveaways.filter(
          (g) => g.messageID === interaction.message.id
        );
        if (interaction.user.id === data[0].host) {
          return interaction.reply({
            content:
              "You can't enter this giveaway because you're hosting it !",
            ephemeral: true,
          });
        }
        if (!data[0].clickers.includes(interaction.user.id)) {
          Guild.updateOne(
            {
              guildID: interaction.guild.id,
              "giveaways.messageID": interaction.message.id,
            },
            {
              $push: {
                "giveaways.$.clickers": interaction.user.id,
              },
            }
          ).then();
          return interaction.reply({
            content: "You have successfully entered this giveaway !",
            ephemeral: true,
          });
        }
        if (data[0].clickers.includes(interaction.user.id)) {
          return interaction.reply({
            content: "You already entered this giveaway !",
            ephemeral: true,
          });
        }
      }
      /////////////////////////////////////////
      /////////////////////////////////////////
      if (tag[1] === "end") {
        const data = settings.giveaways.filter(
          (g) => g.messageID === interaction.message.id
        );
        const host = client.users.cache.get(data[0].host);
        if (interaction.user.id !== tag[2])
          return interaction.reply({
            content: "You cannot end this giveaway as you didn't host it !",
            ephemeral: true,
          });
        const winners = await choose(data[0].winners, data, data[0].host);
        /////////////////////////////////////////
        /////////////////////////////////////////
        if (!winners) {
          interaction.message.edit({ components: [errbuttons] });
          const gembbed = new MessageEmbed()
            .setColor("GREY")
            .setTitle(
              `**${client.emoji.gift} ${client.capitalize(data[0].prize)}**`
            )
            .setDescription(
              `**No valid entrants. No winner could be determined !**\n\n__**Information :**__\n**??? ???? Host :** <@${host.id}>\n**??? ??????????? Winners :** \`None\``
            )
            .setFooter(`{echo} | Ended`)
            .setTimestamp();
          const link = new MessageEmbed()
            .setColor("BLURPLE")
            .setDescription(
              `[???](https://discord.com/channels/${interaction.guild.id}/${interaction.message.channel.id}/${interaction.message.id})`
            );
          Guild.updateOne(
            {
              guildID: interaction.guild.id,
              "giveaways.messageID": interaction.message.id,
            },
            {
              $set: {
                "giveaways.$.ended": true,
              },
            }
          ).then();
          interaction.message.edit({
            embeds: [gembbed],
            components: [errbuttons],
          });
          await interaction.reply({
            content: "Read below ???",
            ephemeral: true,
          });
          return interaction.message.channel.send({
            content: `No valid entrants, so there is no winner !`,
            embeds: [link],
          });
        }
        /////////////////////////////////////////
        /////////////////////////////////////////
        Guild.updateOne(
          {
            guildID: interaction.guild.id,
            "giveaways.messageID": interaction.message.id,
          },
          {
            $set: {
              "giveaways.$.ended": true,
            },
          }
        ).then();
        interaction.reply({
          content: "Successfully ended this giveaway !",
          ephemeral: true,
        });
        const endEmbed = new MessageEmbed()
          .setColor("GREY")
          .setTitle(
            `**${client.emoji.gift} ${client.capitalize(data[0].prize)}**`
          )
          .setDescription(
            `**Giveaway ended !**\n\n__**Information :**__\n**??? ???? Host :** <@${
              data[0].host
            }>\n**??? ??????????? Winner(s) :** ${winners
              .map((winner) => `<@${winner}>`)
              .join(", ")}`
          )
          .setFooter(`{echo} | Ended`)
          .setTimestamp();
        const links = new MessageEmbed()
          .setColor("BLURPLE")
          .setDescription(
            `[???](https://discord.com/channels/${interaction.guild.id}/${interaction.message.channel.id}/${interaction.message.id})`
          );
        interaction.message.edit({ embeds: [endEmbed], components: [buttons] });
        interaction.message.channel.send({
          content: `**${client.emoji.trophy} Congratulation ${winners
            .map((winner) => `<@${winner}>`)
            .join(", ")} ! You won \`${client.capitalize(data[0].prize)}\` !**`,
          embeds: [links],
        });
      }
      /////////////////////////////////////////
      /////////////////////////////////////////
      if (tag[1] === "reroll") {
        const data = settings.giveaways.filter(
          (g) => g.messageID === interaction.message.id
        );
        if (interaction.user.id !== tag[2])
          return interaction.reply({
            content: "You cannot reroll this giveaway as you didn't host it !",
            ephemeral: true,
          });
        /////////////////////////////////////////
        const newWinners = await choose(data[0].winners, data, data[0].host);
        const rerollEmbed = new MessageEmbed()
          .setColor("GREY")
          .setTitle(
            `**${client.emoji.gift} ${client.capitalize(data[0].prize)}**`
          )
          .setDescription(
            `**Giveaway ended !**\n\n__**Information :**__\n**??? ???? Host :** <@${
              data[0].host
            }>\n**??? ??????????? Winner(s) :** ${newWinners
              .map((winner) => `<@${winner}>`)
              .join(", ")}`
          )
          .setFooter(`{echo} | Ended`)
          .setTimestamp();

        const linkss = new MessageEmbed()
          .setColor("BLURPLE")
          .setDescription(
            `[???](https://discord.com/channels/${interaction.guild.id}/${interaction.message.channel.id}/${interaction.message.id})`
          );

        interaction.message.edit({
          embeds: [rerollEmbed],
          components: [buttons],
        });
        await interaction.reply({
          content: `Successfully rerolled the giveaway !`,
          ephemeral: true,
        });
        interaction.message.channel.send({
          content: `**${client.emoji.trophy} Rerolled giveaway ! ${
            newWinners.length > 1
              ? `The new winners are ${newWinners
                  .map((winner) => `<@${winner}>`)
                  .join(", ")}`
              : `The new winner is ${newWinners
                  .map((winner) => `<@${winner}>`)
                  .join(", ")}`
          }**`,
          embeds: [linkss],
        });
      }
    }
  }
  ///////////////////////////////////////////
  //            Menu Handling              //
  ///////////////////////////////////////////
  if (interaction.isSelectMenu()) {
    function jsondes(lan, cat, name) {
      const file = require(`../languages/${lan}/${cat}/${name}`);
      if (file) {
        const des = file.DESCRIPTION || interactionLan.NODES;
        return des;
      }
    }
    const [category] = interaction.values;
    const commands = client.commands.filter(
      (cmd) => cmd.help.category === category && !cmd.help.hidden
    );

    const embed = new MessageEmbed()
      .addFields(
        commands.map((cmd) => {
          return {
            name: `${cmd.help.emoji} - \`${cmd.help.name}\``,
            value: jsondes(settings.language, cmd.help.category, cmd.help.name),
            inline: true,
          };
        })
      )
      .setColor(client.colors.echo)
      .setFooter(interaction.user.username, interaction.user.avatarURL())
      .setTimestamp()
      .setTitle(`${client.capitalize(category)} ${interactionLan.CMD} :`);

    const menu = new MessageSelectMenu()
      .setCustomId(`help-category-menu-${interaction.user.id}`)
      .setPlaceholder(`${interactionLan.PLACEHOLDER}`)
      .setMaxValues(1)
      .addOptions(
        client.categories(interactionLan).map((cat) => {
          return {
            emoji: cat.emoji,
            label: cat.label,
            value: cat.value,
          };
        })
      );

    const menus = new MessageActionRow().addComponents(menu);

    interaction.update({ embeds: [embed], components: [menus] });
  }
  if (interaction.isCommand()) {
    ///////////////////////////////////////////
    //            Slash Handling             //
    ///////////////////////////////////////////
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) return;

    const args = [];
    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }

    const clientSideCommand = client.commands.get(interaction.commandName);
    const language = require(`../languages/${settings.language}/${clientSideCommand.help.category}/${interaction.commandName}`);

    cmd.run(client, interaction, args, language, settings);
  }

  if (interaction.isContextMenu()) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (cmd) cmd.run(client, interaction, settings, args);
  }
};

async function choose(winners, data, host) {
  if (winners > data[0].clickers.length + 1) return null;

  const final = [];

  for (let i = 0; i < winners; i++) {
    if (!data[0].clickers) return null;

    const oneWinner = data[0].clickers[Math.floor(Math.random() * 1)];
    if (oneWinner === host) return i - 1;

    if (!oneWinner) return null;

    final.push(oneWinner);
  }
  return final.length ? final : null;
}
