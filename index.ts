import * as Discord from "discord.js";
import { ClientCollections } from "./discord";
import { ApplicationCommandData } from "discord.js";
import * as fs from "fs";

const client: ClientCollections = new Discord.Client({
  intents: new Discord.Intents(512),
});
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync("./commands");

client.once("ready", () => {
  console.log("Ready!");

  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./commands/${folder}`)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      client.commands.set(command.name, command);
    }
  }
  let commands: ApplicationCommandData[] = [];
  client.commands.forEach((command) => {
    commands.push({
      name: command.name,
      description: command.description,
      options: command.options,
    });
  });
  client.application.commands.set(commands);
});

client.on("interaction", async (interaction) => {
  if (!interaction.isCommand()) return;

  const applicationCommand = await client.application.commands.fetch(
    interaction.commandID,
    { guildID: interaction.guildID }
  );

  const command = client.commands.get(applicationCommand.name);

  // if (command.guildOnly && message.channel.type === "dm") {
  //   return message.reply("I can't execute that command inside DMs!");
  // }

  // if (command.permissions) {
  //   const authorPerms = message.channel.permissionsFor(message.author);
  //   if (!authorPerms || !authorPerms.has(command.permissions)) {
  //     return message.reply("You can not do this!");
  //   }
  // }

  // if (command.args && !args.length) {
  //   let reply = `You didn't provide any arguments, ${message.author}!`;
  //
  //   if (command.usage) {
  //     reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
  //   }
  //
  //   return message.channel.send(reply);
  // }
  //
  const { cooldowns } = client;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      return;
    }
  }

  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

  try {
    await command.execute(interaction, applicationCommand);
  } catch (error) {
    console.error(error);
  }
});

client.login(process.env.TOKEN);
