"use client"
import { useEffect, useState } from "react"
import { getUser } from "@/lib/user";
import {useRouter} from "next/navigation"
import {useSession} from "next-auth/react"
import Header from "../_components/Header";
import Order from "./Order";
import useSWR from "swr";
import axios from "axios";
import Image from "next/image";


export default function MyOrder(){
    const {data : userData} = useSession();
    const {data : orderData,mutate : mutateOrder} = useSWR("/api/order/"+userData?.user?.email,(url) => axios.get(url).then(({data}) => data))
    const [delivery] = useState(30);

    const router = useRouter();
    
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

    return (
        <div className="px-10 md:px-20 relative">
            <Header/>
            <div className="w-full flex flex-col justify-center items-center">
                
                {
                    orderData && orderData.length !== 0 ?
                    (
                        <>
                            <div className="w-[75%] flex items-center">
                                <h1 className="font-semibold text-2xl mt-5 text-left">My Orders</h1>
                            </div>
                            <div className=" w-[70%] grid lg:grid-cols-[repeat(2,1fr)] sm:grid-cols-1 gap-5 mt-5">
                                {
                                    orderData.map((order : object,index : number) => 
                                        <Order key={index} orderId={order.order_id} date={order.createdAt} food={order.food} delivery={delivery} totalAmount={order.amount}/>
                                    )
                                }
                            </div>
                        </>
                    )
                    :
                    (
                        <div className="w-full h-[80vh] flex flex-col justify-start items-center">
                            <h1 className="text-primary text-[50px]">Please order something!</h1>
                            <Image
                                src={"/empty_cart.png"}
                                alt="empty_cart"
                                width={200}
                                height={200}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    )
}