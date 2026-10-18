require("dotenv").config();
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("rename test")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("channel für rename")
        .setRequired(true),
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("amount of messages to delete")
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    try {
      const targetChannel = interaction.options.getChannel("channel");
      const amount = interaction.options.getNumber("amount");
      const messages = await targetChannel.messages.fetch({ limit: amount });
      let deleted = 0;
      await interaction.reply(
        `Lösche... ${deleted.toString()} von ${messages.size} Nachrichten gelöscht.`,
      );
      for (const message of messages.values()) {
        await message.delete();
      }
      await interaction.channel.send(`${messages.size} Nachrichten gelöscht.`);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Nachrichten konnten nicht gelöscht werden.",
        ephemeral: true,
      });
    }
  },
};
