"use client"
import {getUser} from "@/lib/user"
import {useSession} from "next-auth/react"
import {useRouter} from "next/navigation"
import { useEffect } from "react"
import Sidebar from "../Sidebar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AddCategory from "@/app/_components/AddCategory"
import useSWR from "swr"
import axios from "axios"
import UpdateCategory from "../_update/UpdateCategory"
import DeleteButton from "@/app/_components/DeleteButton"

export default function Category(){
    const {data : categoryData,mutate : mutateCategory} = useSWR("/api/category",(url) => axios.get(url).then(({data}) => data))
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
                <div className="text-2xl font-medium p-2 text-center">All Categories Data</div>
                <AddCategory mutate={mutateCategory} className={"absolute right-10 top-2.5"}/>
                <div className="p-2 mt-3 border border-gray-500 rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">Id</TableHead>
                                <TableHead className="text-center">Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                categoryData && categoryData.map((category:object,index:number) => 
                                    <TableRow key={index} className="relative">
                                        <TableCell className="text-center w-[200px]">{index+1}.</TableCell>
                                        <TableCell className="text-center w-[300px]">{category.name}</TableCell>
                                        <TableCell className="w-[200px]"><UpdateCategory mutate={mutateCategory} disable={category.name === "All"} category={category} className="bg-emerald-500 hover:bg-emerald-400"/></TableCell>
                                        <TableCell className=""><DeleteButton deleteId={category.category_id} disable={category.name === "All"} type={"category"} mutate={mutateCategory} title={"Are you sure about deleting this category ?"}/></TableCell>
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