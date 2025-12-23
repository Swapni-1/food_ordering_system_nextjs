"use client"
import {getUser} from "@/lib/user"
import {useSession} from "next-auth/react"
import {useRouter} from "next/navigation"
import { useEffect } from "react"
import Sidebar from "../Sidebar"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import AddFood from "@/app/_components/AddFood"
import useSWR from "swr"
import axios from "axios"
import UpdateFood from "../_update/UpdateFood"
import DeleteButton from "@/app/_components/DeleteButton"

export default function Food(){
    const {data : foodData,mutate : mutateFood} = useSWR("/api/food",(url) => axios.get(url).then(({data}) => data))
    const router = useRouter();
    const {data : userData} = useSession();
    useEffect(() => {
        getUser(userData?.user?.email as string)
        .then((data) => {
            if(!data){
                router.push("/");
            }
        })
        .catch((error) => console.log(error))
    },[])

    return (
        <div className="w-full flex">
            <Sidebar/>
            <div className="w-4/5 relative">
                <div className="text-2xl font-medium p-2 text-center">All Foods Data</div>
                <AddFood mutate={mutateFood} className={"absolute right-10 top-2.5"}/>
                <div className="p-2 mt-3 border border-gray-500 rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Id</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Categories</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                foodData && foodData.map((food,index) => 
                                    <TableRow key={index}>
                                        <TableCell>{index+1}.</TableCell>
                                        <TableCell>{food.name}</TableCell>
                                        <TableCell>{food.description.length > 15 ? food.description.slice(0,15)+"..." : food.description}</TableCell>
                                        <TableCell>{food.foodImg.length > 15 ? food.foodImg.slice(0,15)+"..." : food.foodImg}</TableCell>
                                        <TableCell>₹ {food.price}</TableCell>
                                        <TableCell>
                                            {
                                                food.categories.map((category : object,index : number) => 
                                                    <div key={index} className="text-center">{category.name}</div>
                                                )
                                            }
                                        </TableCell>
                                        <TableCell><UpdateFood mutate={mutateFood} food={food} className="bg-emerald-500 hover:bg-emerald-400"/></TableCell>
                                        <TableCell><DeleteButton deleteId={food.food_id} type={"food"} mutate={mutateFood} title={"Are you sure about deleting this food ?"}/></TableCell>
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