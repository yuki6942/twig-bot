import { model, Schema } from "mongoose";

export interface IWhitelistEntry { 
    userId: string;
    ingameName: string;
    userTag: string;
    status: 'pending' | 'approved' | 'rejected';
    processedBy?: string;
    processedAt?: Date;
    timestamp: Date;
}

const WhitelistEntrySchema = new Schema<IWhitelistEntry>({
    userId: { type: String, required: true, unique: true },
    userTag: { type: String, required: true },
    ingameName: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    processedBy: { type: String },
    processedAt: { type: Date },
    timestamp: { type: Date, default: Date.now }
});

export default model<IWhitelistEntry>("WhitelistEntry", WhitelistEntrySchema);