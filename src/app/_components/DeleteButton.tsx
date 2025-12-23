"use client"
import { Button } from "@/components/ui/button"
import { Dialog,DialogContent,DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react";
import {deleteUserById,deleteFoodById,deleteCategoryById} from "@/lib/delete";

export default function DeleteButton({title,mutate,type,disable,deleteId}){
    const [open,setOpen] = useState(false);
    function handleClick(){
        switch(type){
            case "user" : deleteUserById(deleteId,mutate,closeDialog);
            break;

            case "food" : deleteFoodById(deleteId,mutate,closeDialog);
            break;

            case "category" : deleteCategoryById(deleteId,mutate,closeDialog);
            break;
        }
    }

    function closeDialog(){
        setOpen(false);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button  variant={"destructive"} disabled={disable}>Delete</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">{title}</DialogTitle>
            </DialogHeader>
            <div className="flex justify-between items-center px-[6rem] mt-4">
                <Button onClick={closeDialog} variant={"outline"}>Close</Button>
                <Button onClick={handleClick} variant={"destructive"}>Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
    )
}