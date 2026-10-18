require("dotenv").config();
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rename")
    .setDescription("rename test")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("channel für rename")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("new-name")
        .setDescription("neuer name für channel")
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    try {
      const targetChannel = interaction.options.getChannel("channel");
      const newName = interaction.options.getString("new-name");
      targetChannel.setName(newName);

      await interaction.reply("Pong!");
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "Guild oder Channel konnte nicht gefunden werden.",
      );
    }
  },
};
