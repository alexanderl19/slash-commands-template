import { Command } from "../../discord";

const command: Command = {
  name: "ping",
  description: "Ping!",
  cooldown: 1,
  async execute(interaction) {
    await interaction.reply("Pong.");
  },
};

module.exports = command;
