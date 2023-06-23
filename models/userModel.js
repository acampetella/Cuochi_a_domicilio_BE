import {Schema, model} from 'mongoose';

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthDate: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    avatar: {
        type: String,
        required: false
    },
    cover: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: false,
        default: 'user'
    },
    contacts: {
        phones: [{
            type: String,
            required: false
        }],
        emails: [{
            type: String,
            required: false
        }]
    }
}, {
    timestamps: true, strict: true
});

const UsersModel = model('UserModel', UserSchema, 'users');
export default UsersModel;