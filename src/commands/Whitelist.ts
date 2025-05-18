import { Application, ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import Category from "../base/enums/Category";

export default class Whitelist extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "whitelist",
            description: "Whitelist command",
            category: Category.UTILITY,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: false,
            cooldown: 3,
            options: [
                {
                    name: "request",
                    description: "Request to be whitelisted",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "ingame-name",
                            description: "Your ingame name",
                            type: ApplicationCommandOptionType.String,
                            required: true
                         }
                    ]
                },
                {
                    name: "status",
                    description: "Set the whitelist status",
                    type: ApplicationCommandOptionType.Subcommand,
                },

            ]
        });
    }

    Execute(interaction: ChatInputCommandInteraction) {
        interaction.reply({ content: "Test command executed!", ephemeral: true });
    }
}