import { model, Schema } from "mongoose";

interface IWhitelistConfig { 
    id: Number;
    whitelistStatus: boolean;
}

export default model<IWhitelistConfig>("WhitelistConfig", new Schema<IWhitelistConfig>({
    id: Number,
    whitelistStatus: Boolean,
}, {
    timestamps: true,
}));