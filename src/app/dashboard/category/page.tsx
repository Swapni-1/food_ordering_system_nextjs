import {auth} from "@/auth"
import Category from "./Category";
import Auth from "@/app/_components/Authentication";

export default async function Home(){
    const session = await auth();
    
    if(!session?.user) return <Auth/>
    return <Category/>
}