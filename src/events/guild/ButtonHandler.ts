import { ButtonInteraction, Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import WhitelistEntry from "../../base/schemas/WhitelistEntry";

export default class ButtonHandler extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.InteractionCreate,
            description: "Button handler event",
            once: false,
        });
    }

    async Execute(interaction: ButtonInteraction) {
        if (!interaction.isButton()) return;

        // Helper to disable both buttons
        const disableButtons = () => {
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId(`whitelist_accept_${interaction.customId.split("_").pop()}`)
                    .setLabel("Accept")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId(`whitelist_reject_${interaction.customId.split("_").pop()}`)
                    .setLabel("Reject")
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
            );
            return [row];
        };

        if (interaction.customId.startsWith("whitelist_accept_")) {
            const userId = interaction.customId.replace("whitelist_accept_", "");
            const entry = await WhitelistEntry.findOneAndUpdate(
                { userId },
                { status: "approved", processedBy: interaction.user.id, processedAt: new Date() }
            );
            if (!entry) return interaction.reply({ content: "Entry not found.", ephemeral: true });

            try {
                const user = await interaction.client.users.fetch(userId);
                await user.send({
                    embeds: [new EmbedBuilder()
                        .setColor("Green")
                        .setTitle("Whitelist Request Approved")
                        .setDescription("✅ Your whitelist request has been approved!")
                    ]
                });
            } catch {
                await interaction.reply({ content: "User could not be DMed.", ephemeral: true });
                // Lock buttons even if DM fails
                await interaction.message.edit({ components: disableButtons() });
                return;
            }

            // Update the embed
            const embed = EmbedBuilder.from(interaction.message.embeds[0])
                .setColor("Green")
                .setDescription(
                    (interaction.message.embeds[0].description
                        ? interaction.message.embeds[0].description.replace(/🟠 \*\*Status:\*\* Pending|🔴 \*\*Status:\*\* Rejected|🟢 \*\*Status:\*\* Approved/, "🟢 **Status:** Approved")
                        : null)
                );

            await interaction.message.edit({
                embeds: [embed],
                components: disableButtons()
            });
            await interaction.reply({ content: "User approved and notified.", ephemeral: true });
        }

        if (interaction.customId.startsWith("whitelist_reject_")) {
            const userId = interaction.customId.replace("whitelist_reject_", "");
            const entry = await WhitelistEntry.findOneAndUpdate(
                { userId },
                { status: "rejected", processedBy: interaction.user.id, processedAt: new Date() }
            );
            if (!entry) return interaction.reply({ content: "Entry not found.", ephemeral: true });

            try {
                const user = await interaction.client.users.fetch(userId);
                await user.send({
                    embeds: [new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("Whitelist Request Rejected")
                        .setDescription("❌ Your whitelist request has been rejected.")
                    ]
                });
            } catch {
                await interaction.reply({ content: "User could not be DMed.", ephemeral: true });
                await interaction.message.edit({ components: disableButtons() });
                return;
            }

            // Update the embed
            const embed = EmbedBuilder.from(interaction.message.embeds[0])
                .setColor("Red")
                .setDescription(
                    interaction.message.embeds[0].description
                        ? interaction.message.embeds[0].description.replace(/🟠 \*\*Status:\*\* Pending|🟢 \*\*Status:\*\* Approved|🔴 \*\*Status:\*\* Rejected/, "🔴 **Status:** Rejected")
                        : null
                );

            await interaction.message.edit({
                embeds: [embed],
                components: disableButtons()
            });
            await interaction.reply({ content: "User rejected and notified.", ephemeral: true });
        }
    }
}