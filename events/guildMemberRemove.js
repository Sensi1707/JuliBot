const { Events, EmbedBuilder } = require("discord.js");
const { userCountChannelId, welcomeChannelId } = require("../config.json");

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    const userCountChannel =
      member.guild.channels.cache.get(userCountChannelId);
    const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
    if (!welcomeChannel) return;

    const welcomeEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("Klassenverräter!")
      .setDescription(
        `${member}, hat sich vom Server gekirked! Wir sind nur noch ${member.guild.memberCount}.`,
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    userCountChannel.setName(
      "༺ " + member.guild.memberCount.toString() + " ✧ Member ༻",
    );
    welcomeChannel.send({ embeds: [welcomeEmbed] }).catch(console.error);
  },
};
