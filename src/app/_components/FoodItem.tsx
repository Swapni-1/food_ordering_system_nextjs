"use client"
import { handleAddCart } from "@/lib/cart"
import { SquarePlus } from "lucide-react"
import Image from "next/image"
import {useSession} from "next-auth/react"
import { Bounce, toast } from "react-toastify"
import { useMutateCart } from "../_hooks/useMutateCart"
import axios from "axios"

export default function FoodItem({src,name,price,description,foodId}){

    const {data} = useSession();
    const {mutateCart} = useMutateCart();

    function addToCart(){
        
        axios.post("/api/cart/"+data?.user?.email,{foodId})
        .then(({data}) => {
            if(data !== "already exists"){
                mutateCart();
                toast.success('Added to cart', {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                    });
            }else{
                toast.warn('Already in cart', {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                    });
            }
            console.log(data);
        })
        .catch(error => console.log(error))
    }
    return(
        <div className="p-2 flex gap-3 border rounded-xl hover:border-primary cursor-pointer">
            <Image
                src={src}
                alt={name}
                width={120}
                height={120}
                unoptimized={true}
                className="object-cover w-[120px] h-[120px] rounded-xl"
            />
            <div className="flex flex-col gap-1">
                <h2 className="font-bold">{name}</h2>
                <h2>₹{price}</h2>
                <h2 className="text-sm text-gray-400 line-clamp-2">{description}</h2>
                <SquarePlus onClick={addToCart}/>
            </div>
        </div>
    )
}