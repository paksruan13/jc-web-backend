import { mongooseConnect } from "@/lib/mongoose";
import { Service } from "@/models/Service";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res){
    const{method} = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if(method === 'GET'){
        if(req.query?.id){
            res.json(await Service.findOne({_id:req.query.id}))
        } else{
            res.json(await Service.find());
        }
    }
    if(method === 'POST'){
        const {title, description, price, images, category, properties} = req.body;
        const serviceDoc = await Service.create({
            title, description, price, images, category, properties,
        })
        res.json(serviceDoc);
    }

    if(method === 'PUT'){
        const {title, description, price, images, category, properties, _id,} = req.body;
        await Service.updateOne(
            {_id}, 
            {title, description, price, images, category, properties});
        res.json(true);
    }

    if(method === 'DELETE'){
        if(req.query?.id){
            await Service.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}