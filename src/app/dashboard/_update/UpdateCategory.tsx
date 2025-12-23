"use client"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {z} from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Bounce, toast } from "react-toastify";

const categorySchema = z.object({
    name : z.string({required_error : "username cannot be empty"}).min(3,"name must have at least 3 characters"),
  })

export default function UpdateCategory({className,disable,category,mutate,}){
    const [open,setOpen] = useState(false);

    const categoryForm = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name : category.name
        },
    })

    function handleDialogChange(isOpen : boolean){
        setOpen(isOpen);
        categoryForm.setValue("name",category.name);
        if(!isOpen){
          categoryForm.reset();
        }
    }

    function onSubmit(values: z.infer<typeof categorySchema>) {
        const categoryData = {name : values.name}
        if(category.name === values.name){
          toast.warn('no changes has been made!', {
            position: "top-right",
            autoClose: 800,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
            });
            setOpen(false);
        }else{
          axios.put("/api/category/"+category.category_id,categoryData)
          .then(({data}) => {
            console.log(data);
            mutate();
            toast.success('category updated successfully', {
              position: "top-right",
              autoClose: 2000,
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
          .finally(() => {
            setOpen(false);
            categoryForm.reset();
          })
        }
        
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
            <Button className={className} disabled={disable}>Update</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">Update the category</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center overflow-auto">
              <Form {...categoryForm}>
                <form onSubmit={categoryForm.handleSubmit(onSubmit)} className="space-y-2 w-[80%] p-2 max-h-[25rem] overflow-auto scrollbar-hide ">
                <FormField
                      control={categoryForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input type="text" className="border border-gray-500" placeholder="samosa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="bg-primary shadow-md mt-2">Update</Button>
                </form>
              </Form>
              </div>
            </DialogContent>
        </Dialog>
        
    )
}