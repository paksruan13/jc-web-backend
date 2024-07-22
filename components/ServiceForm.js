import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./spinner";
import { ReactSortable } from "react-sortablejs";


export default function ServiceForm({
    _id, 
    title:existingTitle, 
    description:existingDescription, 
    price:existingPrice, 
    images:existingImages,
    category:assignedCategory,
    properties:assignedProperties,
}){
    const [title, setTitle] = useState(existingTitle || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [description, setDescription] = useState(existingDescription || '');
    const[price, setPrice] = useState(existingPrice || '');
    const[images, setImages] = useState(existingImages || []);
    const router = useRouter();
    const [goToService, setGotoService] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const[serviceProp, setServiceProp] = useState(assignedProperties || {});
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }, [])
    async function saveService(ev){
        ev.preventDefault();
        const data = {title, description, price, images, category, properties:serviceProp};
        if(_id){
            //update
            await axios.put('/api/services', {...data, _id});

        } else {
            //create
            await axios.post('/api/services', data);
        }
        setGotoService(true);
    }
    if(goToService){
        router.push('/services');
    }

    async function uploadImages(ev){
        const files = ev.target?.files;
        if(files?.length > 0){
            setIsUploading(true);
            const data = new FormData();
            for(const file of files){
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }
    function updateImagesOrder(images){
        setImages(images);
    }

    function changeServiceProp(propName, value){
        setServiceProp(prev => {
            const newServiceProps = {...prev};
            newServiceProps[propName] = value;
            return newServiceProps;
        })
    }

    const propertiesToFill = [];
    if(categories.length > 0 && category){
        let cateInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...cateInfo.properties);
        while(cateInfo?.parent?._id){
            const parentCate = categories.find(({_id}) => _id === cateInfo?.parent?._id);
            propertiesToFill.push(...parentCate.properties);
            cateInfo = parentCate;
        }
    }
    return(
            <form onSubmit={saveService}>
                <label>Service Name</label>
                <input type = "text" placeholder = "Service Name"  value={title} onChange={ev => setTitle(ev.target.value)}/>
                <label>Category</label>
                <select value={category} onChange={ev => setCategory(ev.target.value)}>
                    <option value="">Uncategorized</option>
                    {categories.length > 0 && categories.map(c => (
                        <option value={c._id}>{c.name}</option>
                    ))}
                </select>
                {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                    <div className="">
                        <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                        <div>
                            <select 
                            value = {serviceProp[p.name]} 
                            onChange={ev => changeServiceProp(p.name, ev.target.value)}>
                                {p.values.map(v => (
                                    <option value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
                <label>Photos</label>
                <div className="mb-2 flex flex-wrap gap-2">
                    <ReactSortable 
                    list={images} 
                    className="flex flex-wrap gap-1"
                    setList={updateImagesOrder}>
                    {!!images?.length && images.map(link => (
                        <div key={link} className=" h-24 bg-white p-2 shadow-md rounded-sm border border-gray-200">
                            <img src={link} alt="" className="rounded-lg"/>
                        </div>
                    ))}
                    </ReactSortable>
                    {isUploading && (
                        <div className="h-24 p-1 bg-gray-200 flex items-center rounded-lg">
                            <Spinner/>
                        </div>
                    )}
                    <label className="w-24 h-24 bg-white text-center flex flex-col items-center justify-center text-sm gap-1 text-primary
                    rounded-lg cursor-pointer shadow-sm border-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Add Image
                    </div>
                    <input type = "file" onChange={uploadImages} className="hidden"/>
                    </label>
                </div>
                <label>Description</label>
                <textarea placeholder="Description" value={description} onChange={ev => setDescription(ev.target.value)}></textarea>
                <label>Price</label>
                <input type = "text" placeholder = "Price" value={price} onChange={ev => setPrice(ev.target.value)}/>
                <button type = "submit" className="btn-primary">Save</button>
            </form>
    )
}