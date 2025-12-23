"use client"
import {getUser} from "@/lib/user"
import {useSession} from "next-auth/react"
import {useRouter} from "next/navigation"
import { useEffect, useState } from "react"
import Sidebar from "../Sidebar"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import axios from "axios"
import { date } from "@/lib/date"
import { Search } from "lucide-react"
import NoData from "./NoData"

export default function Order(){
    const {data : orderData,mutate : orderMutate} = useSWR("/api/order",(url) => axios.get(url).then(({data}) => data))
    const router = useRouter();
    const {data : userData} = useSession();
    const [value,setValue] = useState("");
    const [newOrderData,setNewOrderData] = useState([]);
    // let newOrderData = [];
    useEffect(() => {
        if(orderData){
            setNewOrderData(orderData);
        }
        getUser(userData?.user?.email as string)
        .then((data) => {
            if(!data){
                router.push("/");
            }
        })
        .catch((error) => console.log(error))
    },[])

    function handleSearch(event){
        setValue(event.target.value);
    }


    useEffect(() => {
        if(orderData){
            let od = orderData.filter((item) => [item.order_id,item.createdAt.split("T")[0],item.user.username,item.user.email].join("").toLowerCase().includes(value.toLowerCase()));
            setNewOrderData(od);
        }
        
    },[value])

    return (
        <div className="w-full flex">
            <Sidebar/>
            <div className="w-4/5 relative">
            <div className="text-2xl font-medium p-2 text-center">
                Order History
                <div className=" hidden md:flex border p-2 rounded-lg bg-gray-200 w-80 h-10">
                    <input type="text" value={value} onChange={handleSearch} placeholder="khasta poha" className="bg-transparent w-full text-sm outline-none" />
                    <Search className="cursor-pointer"/>
                </div> 
            </div>
                <div className="p-2 mt-3 border border-gray-500 rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order id</TableHead>
                                <TableHead>username</TableHead>
                                <TableHead>Food</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                   value.length === 0 ?
                                    orderData && orderData.map((order,index) => 
                                    <TableRow key={index}>
                                        <TableCell className="w-[2rem]">{order.order_id}</TableCell>
                                        <TableCell>{order.user.username}</TableCell>
                                        <TableCell>
                                            {
                                                order.food.map((f,index) => 
                                                    <div key={index}>{f.name}</div>
                                                )
                                            }
                                        </TableCell>
                                        <TableCell>₹ {order.amount}</TableCell>
                                        <TableCell>{date(order.createdAt)}</TableCell>
                                    </TableRow>
                                )
                                :
                                orderData && newOrderData.length === 0 ?
                                <TableRow>
                                    <TableCell className="text-lg flex items-center gap-5">No data found... <NoData/></TableCell>
                                </TableRow>
                                :
                                orderData && newOrderData.map((order,index) => 
                                    <TableRow key={index}>
                                        <TableCell className="w-[2rem]">{order.order_id}</TableCell>
                                        <TableCell>{order.user.username}</TableCell>
                                        <TableCell>
                                            {
                                                order.food.map((f,index) => 
                                                    <div key={index}>{f.name}</div>
                                                )
                                            }
                                        </TableCell>
                                        <TableCell>₹ {order.amount}</TableCell>
                                        <TableCell>{date(order.createdAt)}</TableCell>
                                    </TableRow>
                                )
                            }
                            
                        </TableBody>
                    </Table>
                </div>

            </div>
        </div>
    )
}