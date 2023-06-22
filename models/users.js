import {Schema, model} from 'mongoose'

const UsersSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    birthDate: {
        type: String,
        required: false
    },
    avatar: {
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
    parents: {
        father: {
            name: {
                type: String
            }
        }
    }
}, {
    timestamps: true, strict: true
})

const UsersModel = model('UserModel', UsersSchema, 'users')
export default UsersModel