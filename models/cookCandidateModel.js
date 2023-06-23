import {Schema, model} from 'mongoose';

const CookCandidateSchema = new Schema({
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
    phone: {
        type: String,
        required: true
    },
    curriculum: {
        type: String,
        required: true
    }
}, {
    timestamps: true, strict: true
});

const CooksCandidatesModel = model('CookCandidateModel', CookCandidateSchema, 'cooksCandidates');
export default CooksCandidatesModel;