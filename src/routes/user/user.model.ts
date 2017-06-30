import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';

import { Document, Schema, Model, model } from "mongoose";

const UserSchema: Schema = new Schema({
    user_id: { type: String },
    name: { type: String, required: true },
    user_name: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true, select: false },
    email: { type: String, required: true }
})

UserSchema.methods.generateHash = (password: string): string => {
    return bcrypt.hashSync(password);
}

UserSchema.methods.comparePassword = (password: string, hash: string): boolean => {
    return bcrypt.compareSync(password, hash);
}

UserSchema.methods.gernerateUserId = (userName: string): string => {
    return userName.replace(/\s+/g, '').toLowerCase();
}

interface IUser extends Document {
    // properties
    user_id: string,
    name: string,
    user_name: string,
    password: string,
    email: string

    // methods
    generateHash: (password: string) => string;
    comparePassword: (password: string, hash: string) => boolean;
    gernerateUserId: (userName: string) => string;

}

export const User: Model<IUser> = model<IUser>('User', UserSchema);

