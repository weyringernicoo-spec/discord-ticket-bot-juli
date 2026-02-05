const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
  EmbedBuilder
} = require("discord.js");

// CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

// READY
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// SLASH COMMAND: /ticketpanel
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ticketpanel") {
    const embed = new EmbedBuilder()
      .setTitle("🎫 Create a Ticket")
      .setDescription("Click the button below to open a support ticket.")
      .setColor(0x2ecc71);

    const button = new ButtonBuilder()
      .setCustomId("create_ticket")
      .setLabel("🎫 Open Ticket")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  }
});

// BUTTON: Ticket erstellen
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "create_ticket") {
    const guild = interaction.guild;
    const user = interaction.user;

    // Prüfen ob Ticket schon existiert
    const existing = guild.channels.cache.find(
      c => c.name === `ticket-${user.id}`
    );

    if (existing) {
      return interaction.reply({
        content: "❌ You already have an open ticket.",
        ephemeral: true,
      });
    }

    // Ticket-Channel erstellen
    const channel = await guild.channels.create({
      name: `ticket-${user.id}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
      ],
    });

    await channel.send({
      content: `<@${user.id}>`,
      embeds: [
        new EmbedBuilder()
          .setTitle("🎫 Ticket Opened")
          .setDescription("Please describe your issue in detail.")
          .setColor(0x2ecc71),
      ],
    });

    await interaction.reply({
      content: `✅ Your ticket has been created: ${channel}`,
      ephemeral: true,
    });
  }
});

// LOGIN (TOKEN kommt aus Railway Variables)
client.login(process.env.TOKEN);
