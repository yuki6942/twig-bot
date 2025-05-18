import { model, Schema } from "mongoose";

interface WhitelistConfig { 
    id: Number;
    whitelistStatus: boolean;
}

export default model<WhitelistConfig>("WhitelistConfig", new Schema<WhitelistConfig>({
    id: Number,
    whitelistStatus: Boolean,
}, {
    timestamps: true,
}));