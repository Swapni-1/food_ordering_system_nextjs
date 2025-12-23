'use client'
import { useMutateCart } from "../_hooks/useMutateCart"
import Image from "next/image";
import { X } from "lucide-react";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";


export default function Cart({cart}){
    const {mutateCart} = useMutateCart();
    const router = useRouter();
    const params = usePathname();
    const [totalAmout,setTotalAmount] = useState(0);

    useEffect(() => {
        if(cart){
            let amount = 0;

            cart.forEach((item) => {
                amount += item.food.price;
            })
            setTotalAmount(amount);
        }

        // console.log(totalAmout);
    },[cart])

    function handleRemoveFromCart(cartId : string){
        axios.delete("/api/cart/"+cartId)
        .then(({data}) => {
            mutateCart();
            toast.success('removed from cart', {
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
        })
        .catch(error => console.log(error))
    }
    
    return (
        <div className="flex flex-col gap-3 w-[230px]">
            <h2 className="font-bold">{cart && cart.length !== 0 ? "My Order" : "Cart is empty"}</h2>
            {
                cart && cart.map((item,index) => (
                    <div key={index} className="flex justify-between items-center">
                        <div className="flex gap-2 justify-center items-center">
                            <Image src={item.food.foodImg} alt={item.food.name} width={40} height={40} className="h-[40px] w-[40px] rounded-lg object-cover"/>
                            <h2 className="text-sm font-semibold">{item.food.name}</h2>
                        </div>
                        <h2 className="font-bold flex justify-center items-center gap-2">₹{item.food.price} <X onClick={() =>  handleRemoveFromCart(item.cart_id)} className="h-4 w-4 text-red-500 cursor-pointer"/></h2>
                    </div>
                    
                ))
            }
            {
                cart && cart.length > 0 && params !== "/checkout" &&
                <Button onClick={() => router.push("/checkout")}>Checkout ₹{totalAmout}</Button>
            }
        </div>
    )
}