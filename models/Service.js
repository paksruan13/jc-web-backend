import mongoose, {model, Schema} from "mongoose";

const ServiceSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    price:{type: Number, required: true},
    images: [{type:String}], 
    category: {type:mongoose.Types.ObjectId, ref:'Category'},
    properties: {type:Object},
}, {
    timestamps: true,
});

export const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
