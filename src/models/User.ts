import mongoose, {Document, Schema} from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    }
});

export default mongoose.model<IUser>('User', UserSchema);