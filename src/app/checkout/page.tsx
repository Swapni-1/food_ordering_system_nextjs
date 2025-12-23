import {auth} from "@/auth"
import Auth from "../_components/Authentication";
import Checkout from "./Checkout";

export default async function Home(){
    const session = await auth();
    
    if(!session?.user) return <Auth/>
    return <Checkout/>
}