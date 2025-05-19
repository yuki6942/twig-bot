import { Application, ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

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
                {
                    name: "accept",
                    description: "Manually accept a whitelist request",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "user",
                            description: "The Discord user ID to accept",
                            type: ApplicationCommandOptionType.User,
                            required: true
                        }
                    ]
                },
                {
                    name: "reject",
                    description: "Manually reject a whitelist request",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "user",
                            description: "The Discord user ID to reject",
                            type: ApplicationCommandOptionType.User,
                            required: true
                        }
                    ]
                },
                {
                    name: "delete",
                    description: "Manually delete a whitelist request entry", 
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "user",
                            description: "The Discord user ID to delete",
                            type: ApplicationCommandOptionType.User,
                            required: true
                        }
                    ]
                },
            ]
        });
    }

    Execute(interaction: ChatInputCommandInteraction) {
        interaction.reply({ content: "Test command executed!", ephemeral: true });
    }
}