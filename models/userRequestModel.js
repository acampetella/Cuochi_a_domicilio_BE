import mongoose, {Schema, model} from 'mongoose';

const RequestSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    },
    cook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    place: {
        street: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        town: {
            type: String,
            required: true
        },
        province: {
            type: String,
            required: true
        }
    },
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuModel',
        required: false
    },
    state: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    }
}, {
    timestamps: true, strict: true
});

const RequestsModel = model('RequestModel', RequestSchema, 'requests');
export default RequestsModel;