"use client"
import { useEffect, useState } from "react"
import { getUser } from "@/lib/user";
import {useRouter} from "next/navigation"
import {useSession} from "next-auth/react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image";
import {Separator} from "@/components/ui/seperator"
import { ArrowRight } from "lucide-react";
import { confirmationDetail } from "@/lib/confirmation"

export default function Confirmation(){
    const {data : userData} = useSession();
    const [confirmData,setConfirmData] = useState([]);
    const [amount,setAmount] = useState(0);
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

    useEffect(() => {
      confirmationDetail(userData?.user?.email as string)
      .then((data) => {
        setConfirmData(data.food);
        setAmount(data.amount);
        // console.log(confirmData)
      })
      .catch(error => console.log(error))
    },[])

    // console.log(confirmData);

    return (
        <div className="w-full flex justify-center items-center bg-slate-200">
            <div className="w-[50%] h-[100vh] max-h-[100vh] flex flex-col justify-between bg-white shadow-lg overflow-auto p-4">
                {/* heading  */}
                <div className="w-full flex flex-col justify-center items-center gap-2">
                    <h1 className="text-primary text-3xl">Food Order Confirmation</h1>
                    <Separator/>
                </div>
                {/* body */}
                <div className="w-full flex flex-col justify-start items-center gap-3 mt-5 h-[50rem]">
                    <p className="font-semibold text-2xl">Thank you for your order!</p>
                    <p>Your order has been confirmed and will be delivered shortly.</p>
                    <Table className="border w-[90%] ml-[2.5rem] rounded-md">
                      <TableHeader>
                        <TableRow className="bg-slate-200 hover:bg-slate-200">
                          <TableHead className="font-bold text-black">No.</TableHead>
                          <TableHead className="font-bold text-black">Item</TableHead>
                          <TableHead className="font-bold text-black">Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {
                          confirmData.map((f,index) => 
                            <TableRow key={index}>
                              <TableCell className="text-black font-semibold">{index+1}.</TableCell>
                              <TableCell className="flex items-center gap-4 text-black font-semibold">
                                <Image 
                                    src={f.foodImg}
                                    alt={f.name}
                                    width={100}
                                    height={100}
                                    className="object-cover rounded-md"
                                />
                                {f.name}
                              </TableCell>
                              <TableCell className="text-black font-semibold">₹{f.price}</TableCell>
                            </TableRow>
                          )
                        }
                        
                      </TableBody>
                    </Table>
                    <div className="flex justify-between w-[70%]">
                      <h2 className="font-bold text-lg">Total <span className="text-sm">{"(including taxes and delivery charges)"}</span> :</h2>
                      <h2 className="font-bold text-lg">₹{amount}</h2>
                    </div>
                    <p onClick={() => router.push("/")} className="text-primary underline cursor-pointer flex items-center gap-2">Continue Ordering Food <ArrowRight size={20}/></p>
                </div>
                {/* footer */}
                
                <div className="flex flex-col gap-2 justify-center items-center mt-5">
                    <Separator className="font-bold"/>
                    <p>Thank you for choosing our services!</p>
                    <p>For any inquires, please contact us at support@gmail.com</p>
                </div>
            </div>
        </div>
    )
}