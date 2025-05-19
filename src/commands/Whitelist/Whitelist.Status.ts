import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import WhitelistConfig from "../../base/schemas/WhitelistConfig";
import WhitelistEntry from "../../base/schemas/WhitelistEntry";

export default class Whitelist extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "whitelist.status",
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const whitelistStatus = await WhitelistConfig.findOne({ whitelistStatus: true });
        const existingEntry = await WhitelistEntry.findOne({ userId: interaction.user.id });

        let statusEmbed: EmbedBuilder;

        if (!whitelistStatus) {
            statusEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Whitelist Status")
                .setDescription(`🔴 **Closed** - Whitelist requests are currently closed.`);
        } else {
            statusEmbed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("Whitelist Status")
                .setDescription(`🟢 **Open** - Whitelist requests are currently open.`);
        }

        // Add user request status if exists
        if (existingEntry) {
            let dot = "🟠";
            let color = 0xfaa61a; 
            let msg = "Your request is currently **pending review**.";
            if (existingEntry.status === "approved") {
                dot = "🟢";
                color = 0x57F287;
                msg = "Your request has already been **approved**.";
            } else if (existingEntry.status === "rejected") {
                dot = "🔴";
                color = 0xED4245;
                msg = "Your previous request was **rejected**. Contact an admin if this is an error.";
            }
            statusEmbed.addFields({
                name: "Your Whitelist Request",
                value: `${dot} **Status:** ${existingEntry.status.charAt(0).toUpperCase() + existingEntry.status.slice(1)}\n${msg}\n**Ingame Name:** ${existingEntry.ingameName}`,
            });
        }

        await interaction.editReply({ embeds: [statusEmbed] });
    }
}