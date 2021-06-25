import { Command } from "../../discord";

const command: Command = {
  name: "beep",
  description: "Beep!",
  cooldown: 1,
  async execute(interaction) {
    await interaction.reply("Boop.");
  },
};

module.exports = command;
