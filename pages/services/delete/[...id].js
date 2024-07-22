import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteServicePage(){
    const router = useRouter();
    const [serviceInfo, setServiceInfo] = useState();
    const {id} = router.query;
    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/services?id='+id).then(response => {
            setServiceInfo(response.data);
        })
    }, [id])
    function goBack(){
        router.push('/services');
    }

async function deleteService(){
    await axios.delete('/api/services?id='+id);
    goBack();
}

    return(
        <Layout>
            <h1 className="text-center p-4">Are you sure you want to delete &nbsp;"{serviceInfo?.title}" ?</h1>
            <div className="flex gap-2 justify-center">
            <button onClick={deleteService} className="btn-red">YES</button>
            <button onClick={goBack} className="btn-default">NO</button>
            </div>
            
        </Layout>
    )
}