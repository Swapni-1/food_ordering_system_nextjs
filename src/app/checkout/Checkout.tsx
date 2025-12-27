'use client'
import { useEffect, useState } from "react";
import Header from "../_components/Header";
import { getUser } from "@/lib/user";
import {useRouter} from "next/navigation"
import {useSession} from "next-auth/react"
import { Separator } from "@/components/ui/seperator";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import axios from "axios";
import Image from "next/image";
import { Bounce, toast } from "react-toastify";
import { PayPalButtons } from "@paypal/react-paypal-js";

export default function Checkout(){
    const {data : userData} = useSession();
    const {data : cartData,mutate : cartMutate} = useSWR("/api/cart/"+userData?.user?.email,(url) => axios.get(url).then(({data}) => data));
    
    const router = useRouter();
    const [deliveryCharges] = useState(0);
    const [totalAmount,setTotalAmount] = useState(0);

    useEffect(() => {
        
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

    useEffect(() => {
        let amount = 0;
        if(cartData && cartData.length === 0) router.push("/");
        if(cartData){
            cartData.forEach((item) => {
                amount += item.food.price
            })
            setTotalAmount(amount);
        }
    },[cartData])

    function handleRemoveFromCart(cartId : string){
        axios.delete("/api/cart/"+cartId)
        .then(({data}) => {
            console.log(data);
            cartMutate();
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
        .catch((error) => console.log(error))
    }

    function addToOrder(){
        if(cartData){
            axios.post("/api/order",{email : userData?.user?.email,cart : cartData,amount : (totalAmount + deliveryCharges + totalAmount * (8/100)).toFixed(2)})
            .then(({data}) => {
                console.log(data);
                toast.success('ordered successfully', {
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
            .then(() => {
                axios.delete("/api/cart/all")
                .then(({data}) => {
                    console.log(data);
                    router.push("/confirmation")
                })
                .catch((error) => console.log(error))
            })
            .catch(error => console.log(error))
        }
    }
    return (
        <div className="px-10 md:px-20 relative">
            <Header/>
            <div className="p-2">
                <h1 className="text-3xl font-semibold">Checkout</h1>
                <div className="flex w-full mt-5">
                    <div className="w-2/3 max-h-[80vh] overflow-auto space-y-5">
                        {
                            cartData && cartData.map((cart,index) => (
                                <div key={index} className="flex gap-8  border hover:border-primary hover:bg-primary/5 w-[90%] rounded-lg p-3 relative">
                                    <Image src={cart.food.foodImg} alt={cart.food.name} width={100} height={100} className="w-[100px] h-[100px] object-cover rounded-md"/>
                                    <div className="flex flex-col justify-start">
                                        <h2 className="font-semibold text-xl">{cart.food.name}</h2>
                                        <h2 className="font-semibold">₹ {cart.food.price}</h2>
                                    </div>
                                    <Button className="absolute right-10 text-[15px] font-bold top-10" onClick={() => handleRemoveFromCart(cart.cart_id)}>Remove</Button>
                                </div>
                            ))
                        }
                    </div>
                    <div className="w-1/3 h-[50vh]">
                        <div className="w-full h-full">
                            <div className="p-3 bg-slate-200 rounded-md">
                                <h1 className="text-center text-xl font-semibold">Total Cart {cartData && `(${cartData.length})`}</h1>
                            </div>
                            <div className="p-2 flex flex-col justify-around gap-4">
                                <div className="flex justify-between font-bold">
                                    <h1>Subtotal:</h1>
                                    <h1>₹{totalAmount}</h1>
                                </div>
                                <Separator/>
                                <div className="flex justify-between font-medium">
                                    <h1>Delivery</h1>
                                    <h1>Free</h1>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <h1>Tax {`(8%)`}:</h1>
                                    <h1>₹{totalAmount * (8/100)}</h1>
                                </div>
                                <Separator/>
                                <div className="flex justify-between font-bold">
                                    <h1>Total</h1>
                                    <h1>₹{(totalAmount + deliveryCharges + totalAmount * (8/100)).toFixed(2)}</h1>
                                </div>
                                {/* {
                                    totalAmount > 0 &&
                                    <PayPalButtons 
                                        style={{layout : "horizontal"}}
                                        onApprove={addToOrder}
                                        createOrder={(data,action) => {
                                            return action.order.create({
                                                purchase_units : [
                                                    {
                                                        amount : {
                                                            value : (totalAmount + deliveryCharges + totalAmount * (8/100)).toFixed(2),
                                                            currency_code : "USD"
                                                        }
                                                    }
                                                ]
                                            })
                                        }}
                                    />
                                } */}
                                {
                                    totalAmount > 0 &&
                                    <Button className="font-bold text-[15px]" onClick={addToOrder}>Make Payment</Button>
                                }
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}