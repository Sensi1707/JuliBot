require("dotenv").config();
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("rename test")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("amount of messages to delete")
        .setRequired(true),
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("channel für rename")
        .setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    try {
      const targetChannel =
        interaction.options.getChannel("channel") || interaction.channel;
      const amount = interaction.options.getNumber("amount");
      await interaction.reply(
        `Lösche... ${amount} Nachrichten werden gelöscht.`,
      );

      let deleted = 0;

      while (deleted < amount) {
        const messages = await targetChannel.messages.fetch({ limit: 100 });
        if (messages.size === 0) break;

        for (const message of messages.values()) {
          await message.delete();
          deleted++;
        }
      }
      await interaction.channel.send(`${deleted} Nachrichten gelöscht.`);
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "Nachrichten konnten nicht gelöscht werden.",
        ephemeral: true,
      });
    }
  },
};
