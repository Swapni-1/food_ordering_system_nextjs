"use client"
import {getUser} from "@/lib/user"
import {useSession} from "next-auth/react"
import {useRouter} from "next/navigation"
import { useEffect } from "react"
import Sidebar from "../Sidebar"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import AddUser from "@/app/_components/AddUser"
import useSWR from "swr"
import axios from "axios"
import UpdateUser from "../_update/UpdateUser"
import DeleteButton from "@/app/_components/DeleteButton"

export default function User(){
    const {data : user_data,mutate : mutateUser} = useSWR("/api/user",(url) => axios.get(url).then(({data}) => data));
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
        <div className="w-full flex relative">
            <Sidebar/>
            <div className="w-4/5">
                <div className="text-2xl font-medium p-2 text-center">All Users Data</div>
                <AddUser mutate={mutateUser} className={"absolute right-10 top-2.5"}/>
                <div className="p-2 mt-3 border border-gray-500 rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Id</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                user_data && user_data.map((user : object,index : number) => {
                                
                                        return (
                                        <TableRow key={index}>
                                            <TableCell>{index+1}.</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell><UpdateUser mutate={mutateUser} user={user} className="bg-emerald-500 hover:bg-emerald-400"/></TableCell>
                                            <TableCell><DeleteButton deleteId={user.user_id} type={"user"} mutate={mutateUser} title={"Are you sure about deleting this user ?"}/></TableCell>
                                        </TableRow>
                                        )
                                })
                            }
                            
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}