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
      const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;

      while (deleted < amount) {
        const messages = await targetChannel.messages.fetch({
          limit: Math.min(100, Math.ceil(amount - deleted)),
        });

        if (messages.size === 0) break;

        const recent = messages.filter((m) => m.createdTimestamp > cutoff);
        const old = messages.filter((m) => m.createdTimestamp <= cutoff);

        let batchDeleted = 0;

        if (recent.size >= 2) {
          batchDeleted += (await targetChannel.bulkDelete(recent, true)).size;
        } else if (recent.size === 1) {
          await recent.first().delete();
          batchDeleted++;
        }

        const results = await Promise.allSettled(
          old.map((message) => message.delete()),
        );

        batchDeleted += results.filter(
          (result) => result.status === "fulfilled",
        ).length;

        if (batchDeleted === 0) break;

        deleted += batchDeleted;

        await interaction.editReply(
          `Lösche... ${deleted}/${amount} Nachrichten gelöscht.`,
        );
      }

      await interaction.editReply(`${deleted} Nachrichten gelöscht.`);
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "Nachrichten konnten nicht gelöscht werden.",
        ephemeral: true,
      });
    }
  },
};
