import { Application, ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, TextChannel } from "discord.js";
import CustomClient from "../base/classes/CustomClient";
import Category from "../base/enums/Category";
import SubCommand from "../base/classes/SubCommand";
import { connect } from "mongoose";
import WhitelistConfig from "../base/schemas/WhitelistConfig";

export default class Whitelist extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "whitelist.request",
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const ingameName = interaction.options.getString("ingame-name");

        await interaction.deferReply({ ephemeral: true });

        try {

            const whitelistStatus = await WhitelistConfig.findOne({ whitelistStatus: true });
            
            if (!whitelistStatus) {
                return await interaction.followUp({ embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("Whitelist Request")
                    .setDescription(`🔴 **Closed** - Whitelist requests are currently closed.`)
                ], ephemeral: true });
            }
    
            const adminChannel = await interaction.client.channels.fetch(this.client.config.adminChannelId) as TextChannel;
    
            await adminChannel.send({
                embeds: [new EmbedBuilder()
                    .setColor("Gold")
                    .setTitle("New Whitelist Request")
                    .setDescription(`**Ingame Name:** ${ingameName}\n**User:** ${interaction.user.tag}\n**User ID:** ${interaction.user.id}`)
                ]
            });
    
            await interaction.followUp({ embeds: [new EmbedBuilder()
                .setColor("Green")
                .setTitle("Whitelist Request")
                .setDescription(`content: '✅ Your request has been submitted!`)
            ], ephemeral: true });
        } catch (error) {
            console.error("Error in whitelist request command:", error);
            interaction.reply({ content: "❌ An error occurred while processing your request.", ephemeral: true });
        }
    }
}