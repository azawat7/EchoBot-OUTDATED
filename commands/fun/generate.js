const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const fs = require("fs");

module.exports.help = {
  name: "generate",
  aliases: ["gen"],
  category: "fun",
  expectedArgs: null,
  minArgs: 0,
  maxArgs: 0,
  ownerOnly: false,
  userPerms: [],
  clientPerms: ["ATTACH_FILES"],
  nsfw: false,
  cooldown: 3,
  example: 1,
  emoji: "🤘",
};

module.exports.run = async (client, message) => {
  const canvas = Canvas.createCanvas(465, 170);
  const ctx = canvas.getContext("2d");

  /////////////////////////////////////////

  var files1 = fs.readdirSync("./assets/img/mythic");
  var files2 = fs.readdirSync("./assets/img/legendary");
  var files4 = fs.readdirSync("./assets/img/potions");
  var files5 = fs.readdirSync("./assets/img/boots");
  var files6 = fs.readdirSync("./assets/img/starter");

  let chosenFile = files1[Math.floor(Math.random() * 23)];

  let chosenFile1 = files2[Math.floor(Math.random() * 15 + 47)];

  let chosenFile2 = files2[Math.floor(Math.random() * 15 + 32)];

  let chosenFile3 = files2[Math.floor(Math.random() * 15 + 16)];

  let chosenFile4 = files5[Math.floor(Math.random() * 8)];

  let chosenFile5 = files6[Math.floor(Math.random() * 5)];

  let chosenFile6 = files2[Math.floor(Math.random() * 16 + 1)];

  let chosenFile8 = files4[Math.floor(Math.random() * 6)];

  var files7 = [
    `./assets/img/starter/${chosenFile5}`,
    `./assets/img/legendary/${chosenFile6}`,
    `./assets/img/potions/${chosenFile8}`,
  ];

  let chosenFile7 = files7[Math.floor(Math.random() * 3)];

  /////////////////////////////////////////

  var files11 = fs.readdirSync("./assets/img/spells");
  let chosenFile11 = files11[Math.floor(Math.random() * 4 + 5)];

  var files12 = fs.readdirSync("./assets/img/spells");
  let chosenFile12 = files12[Math.floor(Math.random() * 4 + 1)];

  /////////////////////////////////////////

  var files10 = fs.readdirSync("./assets/img/trinkets");
  let chosenFile10 = files10[Math.floor(Math.random() * 3)];

  /////////////////////////////////////////

  const background = await Canvas.loadImage(
    "./assets/img/background/background.jpg"
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#fff";

  /////////////////////////////////////////

  const mythic = await Canvas.loadImage(`./assets/img/mythic/${chosenFile}`);
  ctx.drawImage(mythic, 30, 30, 40, 40);
  ctx.strokeRect(30, 30, 40, 40);

  const legendary = await Canvas.loadImage(
    `./assets/img/legendary/${chosenFile1}`
  );
  ctx.drawImage(legendary, 100, 30, 40, 40);
  ctx.strokeRect(100, 30, 40, 40);

  const legendary1 = await Canvas.loadImage(
    `./assets/img/legendary/${chosenFile2}`
  );
  ctx.drawImage(legendary1, 170, 30, 40, 40);
  ctx.strokeRect(170, 30, 40, 40);

  const legendary2 = await Canvas.loadImage(
    `./assets/img/legendary/${chosenFile3}`
  );
  ctx.drawImage(legendary2, 240, 30, 40, 40);
  ctx.strokeRect(240, 30, 40, 40);

  const boots = await Canvas.loadImage(`./assets/img/boots/${chosenFile4}`);
  ctx.drawImage(boots, 310, 30, 40, 40);
  ctx.strokeRect(310, 30, 40, 40);

  const lastItem = await Canvas.loadImage(`${chosenFile7}`);
  ctx.drawImage(lastItem, 380, 30, 40, 40);
  ctx.strokeRect(380, 30, 40, 40);

  /////////////////////////////////////////

  const spell1 = await Canvas.loadImage(`./assets/img/spells/${chosenFile11}`);
  ctx.drawImage(spell1, 30, 100, 40, 40);
  ctx.strokeRect(30, 100, 40, 40);

  const spell2 = await Canvas.loadImage(`./assets/img/spells/${chosenFile12}`);
  ctx.drawImage(spell2, 100, 100, 40, 40);
  ctx.strokeRect(100, 100, 40, 40);

  /////////////////////////////////////////

  const trinket = await Canvas.loadImage(
    `./assets/img/trinkets/${chosenFile10}`
  );
  ctx.drawImage(trinket, 380, 100, 40, 40);
  ctx.strokeRect(380, 100, 40, 40);

  /////////////////////////////////////////

  const attachment = new MessageAttachment(canvas.toBuffer(), "es.png");

  message.channel.send({ attachments: [attachment] });
};
