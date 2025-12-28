"use client"
import { sidebarData } from "./data"
import clsx from "clsx"
import {useSidebarStore} from "@/app/_hooks/useSelect";
import { useEffect } from "react";
import {useRouter,usePathname} from "next/navigation"
import pascalcase from "pascalcase"
import {signOut} from "next-auth/react"
import { Bounce, toast } from "react-toastify";
import {deleteAllCookies} from "@/lib/removeAllCookies";


export default function Sidebar(){

    const {selectedName,setSelectedName} = useSidebarStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if(pathname.split("/").length === 3){
                // setSelectedName(pathname.split("/")[2].toUpperCase());
                setSelectedName(pascalcase(pathname.split("/")[2]) || "user")
        }else{
            setSelectedName("");
        }
    },[])
    
    useEffect(() => {
        // selectedName

        // console.log(pathname.split("/"));
        switch(selectedName){
            case "User" : router.push("/dashboard/user")
            break;

            case "Food" : router.push("/dashboard/food")
            break;

            case "Category" : router.push("/dashboard/category")
            break;

            case "Order" : router.push("/dashboard/order")
            break;

            case "Logout" :
            deleteAllCookies();
            signOut({callbackUrl : "/",redirect : true})
            .then(() => {
                // router.push("/")
                toast.success('Logout Successful', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
                });
            })
            .catch((error) => console.log(error))
            .finally(() => router.refresh())
            break;
            // default : router.push("/dashboard");
        }

        
    },[selectedName])

    function handleSideBarItem(name : string){
        setSelectedName(name);
    }

    return (
        <div className="w-1/5 h-[100vh] sticky left-0 top-0 p-5 list-none flex flex-col gap-3 shadow-lg">
            
            {/* logo */}
            <li  
                className="flex text-xl font-medium underline cursor-pointer text-primary">Food Ordering System</li>
             
             {
                sidebarData.map((item,index) => (
                    <li className={clsx("flex gap-3 cursor-pointer border p-2 hover:bg-primary/30 rounded-md",selectedName === item.name && "bg-primary/80 text-white hover:text-black hover:border hover:border-gray-500")} key={index} onClick={() => handleSideBarItem(item.name)}> {<item.icon/>} {item.name}</li>
                ))
             }
        </div>
    )
}