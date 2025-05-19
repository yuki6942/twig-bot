import { ChatInputCommandInteraction, EmbedBuilder, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import WhitelistConfig from "../../base/schemas/WhitelistConfig";
import WhitelistEntry from "../../base/schemas/WhitelistEntry";

export default class Whitelist extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "whitelist.request",
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const ingameName = interaction.options.getString("ingame-name");
        const userId = interaction.user.id;
        const userTag = interaction.user.tag;

        try {
            // Always defer reply to avoid interaction errors
            await interaction.deferReply({ ephemeral: true });

            const existingEntry = await WhitelistEntry.findOne({ userId });
            if (existingEntry) {
                let statusMsg = "";
                let color = 0xfaa61a; 
                let dot = "🟠";
                if (existingEntry.status === "pending") {
                    statusMsg = "Your request is currently **pending review**.";
                    color = 0xfaa61a; 
                    dot = "🟠";
                } else if (existingEntry.status === "approved") {
                    statusMsg = "Your request has already been **approved**.";
                    color = 0x57F287;
                    dot = "🟢";
                } else if (existingEntry.status === "rejected") {
                    statusMsg = "Your previous request was **rejected**. Contact an admin if this is an error.";
                    color = 0xED4245;
                    dot = "🔴";
                }

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(color)
                            .setTitle("Whitelist Request")
                            .setDescription(`${dot} You have already submitted a whitelist request with the name **${existingEntry.ingameName}**.\n${statusMsg}`)
                    ],
                });
                return;
            }

            const whitelistStatus = await WhitelistConfig.findOne({ whitelistStatus: true });
            if (!whitelistStatus) {
                await interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("Whitelist Request")
                        .setDescription(`🔴 **Closed** - Whitelist requests are currently closed.`)
                    ]
                });
                return;
            }

            // Create new whitelist entry
            await WhitelistEntry.create({
                userId,
                ingameName,
                userTag,
                status: "pending",
                timestamp: new Date()
            });

            // Admin buttons
            const actionRow = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`whitelist_accept_${userId}`)
                        .setLabel("Accept")
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`whitelist_reject_${userId}`)
                        .setLabel("Reject")
                        .setStyle(ButtonStyle.Danger)
                );

            const adminChannel = await interaction.client.channels.fetch(this.client.config.adminChannelId) as TextChannel;

            await adminChannel.send({
                embeds: [new EmbedBuilder()
                    .setColor("Orange")
                    .setTitle("New Whitelist Request")
                    .setDescription(
                        `**Ingame Name:** ${ingameName}\n` +
                        `**User:** ${userTag}\n` +
                        `**User ID:** ${userId}\n` +
                        `🟠 **Status:** Pending`
                    )
                ],
                components: [actionRow]
            });

            await interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("Whitelist Request")
                    .setDescription(`✅ Your request has been submitted!`)
                ]
            });
        } catch (error) {
            console.error("Error in whitelist request command:", error);
            try {
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply({ content: "❌ An error occurred while processing your request." });
                } else {
                    await interaction.reply({ content: "❌ An error occurred while processing your request.", ephemeral: true });
                }
            } catch (err) {
                console.error("Failed to send error message to user:", err);
            }
        }
    }
}