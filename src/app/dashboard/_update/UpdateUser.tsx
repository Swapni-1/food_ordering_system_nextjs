"use client"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Bounce, toast } from "react-toastify";

const userSchema = z.object({
    username : z.string({required_error : "username cannot be empty"}).min(4,"Fullname must have at least 4 characters"),
    email : z.string({required_error : "email cannot be empty"}).email("Invalid email address"),
    password : z.string({required_error : "password must be empty"}).min(4, 'Password must be at least 4 characters long')
  })

export default function UpdateUser({className,user,mutate}){
    const [open,setOpen] = useState(false);

    const userForm = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username : user.username,
            email : user.email,
            password : user.password
        },
    })

    function handleDialogChange(isOpen : boolean){
        setOpen(isOpen);
        userForm.setValue("username",user.username)
        userForm.setValue("email",user.email)
        userForm.setValue("password",user.password)
    }

    function onSubmit(values: z.infer<typeof userSchema>) {
      
      if(values.username === user.username && values.email === user.email && values.password === user.password){
        toast.warn('no changes has been made', {
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

      const userData = {username : values.username,email : values.email,password : values.password};
      
      axios.put("/api/user/"+user.user_id,userData)
      .then(({data}) => {
        console.log(data);
        mutate();
        toast.success('user updated successfully', {
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
        userForm.reset();
      })
      }
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
            <Button className={className}>Update</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">Update the user</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center overflow-auto">
              <Form {...userForm}>
                <form onSubmit={userForm.handleSubmit(onSubmit)} className="space-y-2 w-[80%] p-2 max-h-[25rem] overflow-auto scrollbar-hide ">
                <FormField
                      control={userForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="johndoe" {...field} className="border border-gray-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={userForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="johndoe@gmail.com" {...field} className="border border-gray-500"/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={userForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>password</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="******" {...field} className="border border-gray-500"/>
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