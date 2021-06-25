import {
  ApplicationCommand,
  ApplicationCommandData,
  Client,
  Collection,
  CommandInteraction,
  Snowflake,
} from "discord.js";

export class ClientCollections extends Client {
  commands?: Collection<string, Command>;
  cooldowns?: Collection<string, Collection<Snowflake, number>>;
}

export interface Command extends ApplicationCommandData {
  cooldown: number;
  execute: (
    interaction: CommandInteraction,
    applicationCommand: ApplicationCommand
  ) => Promise<void>;
}
