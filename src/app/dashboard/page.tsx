import {auth} from "@/auth"
import Auth from "../_components/Authentication";
import {redirect} from "next/navigation"

export const dynamic = 'force-dynamic';

export default async function Home(){
    const session = await auth();
    
    if(!session?.user) return <Auth/>
    return redirect("/dashboard/user")
}