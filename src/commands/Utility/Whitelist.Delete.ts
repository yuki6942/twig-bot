import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import WhitelistEntry from "../../base/schemas/WhitelistEntry";

export default class Whitelist extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "whitelist.delete",
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const WHITELIST_ROLE_ID = this.client.config.whitelistRoleId;
        const userId = interaction.options.getUser("user", true).id;

        // Permission check
        const member = interaction.member as any;
        let hasRole = false;

        // check if member has the role
        if (member?.roles.cache.has(WHITELIST_ROLE_ID)) { 
            hasRole = true;
        } else {
            hasRole = false;
        }

        if (!hasRole) {
            return interaction.reply({ content: "❌ You do not have permission to use this command.", ephemeral: true });
        }

        try {
            await interaction.deferReply({ ephemeral: true });

            const entry = await WhitelistEntry.findOneAndDelete({ userId });
            if (!entry) {
                return await interaction.editReply({ content: "❌ No whitelist entry found for that user." });
            }

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("Whitelist Entry Deleted")
                        .setDescription(`✅ Whitelist entry for <@${userId}> has been deleted.`)
                ]
            });
        } catch (error) {
            console.error("Error in whitelist delete command:", error);
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