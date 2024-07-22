import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}){
    const[editedCate, setEditedCate] = useState(null);
    const [name, setName] = useState('');
    const[categories, setCategories] = useState([]);
    const[parentCategory, setParentCategory] = useState('');
    const[properties, setProperties] = useState([]);
    useEffect(() => {
        fetchCategories();
    }, []);
    function fetchCategories(){
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }
    async function saveCategory(ev){
        ev.preventDefault();
        const data = {
            name, 
            parentCategory, 
            properties:properties.map(p => ({name:p.name, values:p.values.split(','),
            }))};
        if(editedCate){
            data._id = editedCate._id;
            await axios.put('/api/categories', 
                data
            );
            setEditedCate(null);
        }else{
            await axios.post('/api/categories', 
                data
            );
        }
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }
    function editCategory(category){
        setEditedCate(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({name, values}) => ({
                name,
                values:values.join(',')
            }))
        );
    }
    function deleteCategory(category){
        swal.fire({
            title: 'Are You Sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if(result.isConfirmed){
                const{_id} = category;
                await axios.delete('/api/categories?_id='+_id);
                fetchCategories();
            }
        });
    }
    function addProperty(){
        setProperties(prev => {
            return [...prev, {name:'', values:''}];
        });
    }
    function handlePropNameChange(index, property, newName){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        })
    }
    function handlePropValuesChange(index, property, newValues){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        })
    }
    function removeProperty(RemoveIndex){
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== RemoveIndex;
            });
        });
    }
    return(
        <Layout>
            <h1>Categories</h1>
            <label>{editedCate ? `Edit Category ${editedCate.name}` : "Create New Category"}</label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input 
                    type="text" 
                    placeholder={'Category Name'} 
                    onChange={ev=> setName(ev.target.value)}
                    value={name} />
                    <select 
                    onChange={ev => setParentCategory(ev.target.value)}
                    value={parentCategory}>
                        <option value="0">No Parent Category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option value={category._id}>{category.name}</option>
                        ))}
                </select>
                </div>
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button onClick={addProperty} type="button" className="btn-default text-sm mb-2">
                        Add New Property
                    </button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div className="flex gap-1 mb-2">
                            <input
                            type="text"
                            value={property.name}
                            onChange={ev => handlePropNameChange(index, property, ev.target.value)}
                            placeholder="Property Name"
                            className="mb-0"/>
                            <input
                            type="text"
                            value={property.values}
                            onChange={ev => handlePropValuesChange(index, property, ev.target.value)}
                            placeholder="Property Value"
                            className="mb-0"/>
                            <button
                            onClick={() => removeProperty(index)} 
                            type="button"
                            className="btn-red">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {editedCate && (
                        <button 
                        type="button"
                        onClick={() => {
                            setEditedCate(null);
                            setName('');
                            setParentCategory('');
                            setProperties([]);
                        }}
                        className="btn-default">Cancel</button>
                )}
                <button type="submit" className="btn-primary py-1">Save</button>
                </div>
            </form>
            {!editedCate && (
                <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category Name</td>
                        <td>Parent Category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr>
                            <td>
                                {category.name}
                            </td>
                            <td>{category?.parent?.name}</td>
                            <td>
                                    <button onClick={() => editCategory(category)} className="btn-default mr-1">Edit</button>
                                    <button onClick={() => deleteCategory(category)} className="btn-red">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </Layout>
    )
}

export default withSwal (({swal}, ref) => (
    <Categories swal = {swal}/>
)
);
