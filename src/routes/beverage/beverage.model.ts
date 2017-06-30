import * as mongoose from 'mongoose';
import { Document, Schema, Model, model } from 'mongoose';

const BeverageSchema: Schema = new Schema({
    user_id: { type: String, required: true },
    coffee_count: { type: Number },
    tea_count: { type: Number },
    milk_count: { type: Number },
    badam_milk_count: { type: Number },
    day: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: String, required: true },
});

interface IBeverage extends Document {
    user_id: string,
    coffee_count: number,
    tea_count: number,
    milk_count: number,
    badam_milk_count: number,
    day: string,
    month: string,
    year: string
}

export const Beverage: Model<IBeverage> = model<IBeverage>('Beverage', BeverageSchema);
