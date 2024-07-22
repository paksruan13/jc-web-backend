import Layout from "@/components/Layout";
import ServiceForm from "@/components/ServiceForm";

export default function newService(){
    return (
        <Layout>
            <h1>New Service</h1>
            <ServiceForm />
        </Layout>
    )
}