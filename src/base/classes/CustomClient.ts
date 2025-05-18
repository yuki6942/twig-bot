import { Client, Collection, GatewayIntentBits } from "discord.js";
import IConfig from "../interfaces/IConfig";
import Handler from "./Handler";
import Command from "./Command";
import SubCommand from "./SubCommand";
import { connect } from "mongoose";

export default class CustomClient extends Client {
    
    handlers: Handler;
    config: IConfig;
    commands: Collection<string, Command>;
    subCommands: Collection<string, SubCommand>;
    cooldowns: Collection<string, Collection<string, number>>;

    constructor() {
        super({ intents: [GatewayIntentBits.Guilds] })

        this.config = require(`${process.cwd()}/data/config.json`);
        this.handlers = new Handler(this);
        this.commands = new Collection();
        this.subCommands = new Collection();
        this.cooldowns = new Collection();
    }
    Init(): void  {
        this.LoadHandlers();
        this.login(this.config.token).catch((err) => console.log(err));
  
        connect(this.config.mongo_uri).then(() => console.log("Connected to MongoDB")).catch((err) => console.log(err));
    }

    LoadHandlers(): void {
        this.handlers.LoadEvents();
        this.handlers.LoadCommands();
    }
}