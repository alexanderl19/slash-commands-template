import { Command } from "../../discord";

const command: Command = {
  name: "avatar",
  description: "Get the avatar URL of a tagged user, or your own avatar.",
  options: [
    {
      name: "user",
      type: 6,
      description: "Desired user for fetching avatar.",
      required: false,
    },
  ],
  cooldown: 1,
  async execute(interaction) {
    const user = interaction.options.find(
      (option) => option.name === "user" && option.type === "USER"
    );
    if (!user) {
      return interaction.reply(
        `Your avatar: ${interaction.user.displayAvatarURL({ dynamic: true })}`
      );
    } else {
      return interaction.reply(
        `${user.user.username}'s avatar: ${user.user.displayAvatarURL({
          dynamic: true,
        })}`
      );
    }
  },
};

module.exports = command;
