"use client"
import Image from "next/image"
import { LogOut, Search, ShoppingBag, ShoppingCart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {signOut} from "next-auth/react"
import {toast,Bounce} from "react-toastify";
import {useRouter} from "next/navigation"
import { useEffect } from "react";
import {getUser} from "@/lib/user"
import {useSession} from "next-auth/react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Cart from "./Cart";
import axios from "axios";
import useSWR from "swr";
import { useMutateCart } from "../_hooks/useMutateCart";
import {useSearchStore} from "../_hooks/useSearch"


export default function Header(){
    
    const router = useRouter();
    const {data : userData} = useSession();
    const {setMutateCart} = useMutateCart();
    const {search,setSearch} = useSearchStore();
    const {data : cartData,mutate : cartMutate} = useSWR("/api/cart/"+userData?.user?.email,(url) => axios.get(url).then(({data}) => data));

    useEffect(() => {
        // console.log(userData?.user?.email)
        setMutateCart(cartMutate);
        getUser(userData?.user?.email)
        .then((data) => {
            if(data){
                router.push("/dashboard/user")
            }
        })
        .catch((error) => {
            console.log(error);
        })
    },[])

    function handleLogout(){
        // 1. Manually clear the cookie
        document.cookie = "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Also clear the secure version just in case
        document.cookie = "__Secure-next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; samesite=lax; secure";
        signOut({callbackUrl : "/",redirect : true})
        .then(() => {
            toast.success('Logged out successfully', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
                });

            router.refresh();
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    function handleSearch(e){
        const {value} = e.target;

        setSearch(value);     
    }

    return (
        <div className="flex justify-between items-center p-6 md:px-20 shadow-sm">
            {/* logo  */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
                <Image 
                    alt="logo"
                    src={"/logo.png"}
                    width={32}
                    height={32}
                />
                <h1 className="text-3xl"><span className="text-primary">N</span>Eats</h1>
            </div>

            {/* search  */}
            <div className=" hidden md:flex border p-2 rounded-lg bg-gray-200 w-96">
                <input type="text" placeholder="khasta poha" value={search} onChange={handleSearch} className="bg-transparent w-full outline-none" />
                <Search className="cursor-pointer"/>
            </div>

            {/* login  */}

            {/* <div className="flex gap-2">
                <Button variant={"outline"}>Admin</Button>
                <Button>Login</Button>
            </div> */}

            <div className="flex justify-between items-center w-[150px]">
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="flex gap-2 cursor-pointer">
                            <ShoppingCart/>
                            <label className="p-1 px-2 rounded-full bg-slate-200">{cartData && cartData.length}</label>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-full">
                        <Cart cart={cartData}/>
                    </PopoverContent>
                </Popover>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer">
                            <AvatarImage src="https://cdn-icons-png.flaticon.com/512/10307/10307852.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => router.push("/my-order")} className="cursor-pointer">
                        <ShoppingBag/>
                        <span>My orders</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                        <LogOut />
                        <span>Log out</span>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                
            </div>
        </div>
    )
}