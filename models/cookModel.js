import mongoose, {Schema, model} from 'mongoose';

const CookSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    towns: [{
        type: String,
        required: false,
        default: []
    }],
    available: {
        type: Boolean,
        required: false,
        default: false
    },
    personalLinks: [
        {
            linkName: {
                type: String,
                required: true
            },
            linkSource: {
                type: String,
                required: true
            }
        }
    ],
    menus: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuModel',
        default: []
    }]
}, {
    timestamps: true, strict: true
});

const CooksModel = model('CookModel', CookSchema, 'cooks');
export default CooksModel;