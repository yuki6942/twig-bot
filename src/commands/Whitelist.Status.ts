import { Application, ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import CustomClient from "../base/classes/CustomClient";
import Category from "../base/enums/Category";
import SubCommand from "../base/classes/SubCommand";
import { connect } from "mongoose";
import WhitelistConfig from "../base/schemas/WhitelistConfig";

export default class Whitelist extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "whitelist.status",
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {

        const whitelistStatus = await WhitelistConfig.findOne({ whitelistStatus: true });
        
        await interaction.deferReply({ ephemeral: true });
        
            if (!whitelistStatus) {
                return interaction.followUp({ embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("Whitelist Status")
                    .setDescription(`🔴 **Closed** - Whitelist requests are currently closed.`)
                ], ephemeral: true });
            }

            await interaction.followUp({ embeds: [new EmbedBuilder()
                .setColor("Green")
                .setTitle("Whitelist Status")
                .setDescription(`🟢 **Open** - Whitelist requests are currently open.`)
            ], ephemeral: true });
        
    }
}