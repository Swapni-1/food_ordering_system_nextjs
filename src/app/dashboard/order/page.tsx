import {auth} from "@/auth"
import Order from "./Order";
import Auth from "@/app/_components/Authentication";

export default async function Home(){
    const session = await auth();
    
    if(!session?.user) return <Auth/>
    return <Order/>
}