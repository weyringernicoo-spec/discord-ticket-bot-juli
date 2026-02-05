const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log("✅ Bot online als", client.user.tag);
});

client.on("messageCreate", async (msg) => {
  if (msg.content === "!ticketpanel") {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_create")
        .setLabel("🎫 Ticket erstellen")
        .setStyle(ButtonStyle.Primary)
    );

    await msg.channel.send({
      content: "Klicke für Support:",
      components: [row]
    });
  }
});

client.on("interactionCreate", async (i) => {
  if (!i.isButton()) return;

  if (i.customId === "ticket_create") {
    const channel = await i.guild.channels.create({
      name: `ticket-${i.user.username}`.toLowerCase(),
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: i.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: i.user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages
          ]
        }
      ]
    });

    await channel.send(`🎫 Hallo ${i.user}, schreib hier dein Anliegen.`);
    await i.reply({
      content: `✅ Ticket erstellt: ${channel}`,
      ephemeral: true
    });
  }
});

client.login(process.env.TOKEN);

