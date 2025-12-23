"use client"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {z} from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import axios from "axios";
import { Bounce, toast } from "react-toastify";

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
  fixed : z.boolean().optional(),
});

const foodSchema = z.object({
    name : z.string({required_error : "name cannot be empty"}).min(3,"Fullname must have at least 4 characters"),
    description : z.string({required_error : "description cannot be empty"}).min(10,"description must be more than 10 characters"),
    image : z.string({required_error : "url must not be empty"}).url("Invalid url"),
    price: z.string({required_error : "quantity cannot be empty"}).regex(/^\d+(\.\d+)?$/,{message : "please enter valid number"}).transform((val) => val).refine((val) => +val > 0,{message : "price should be greater than zero"}),
    category: z.array(optionSchema).min(1,{message :"Select at least one option"})
  })

export default function AddFood({className,mutate}){
    const [open,setOpen] = useState(false);
    const [categoryData,setCategoryData] = useState<Option[]>([]);

    const foodForm = useForm<z.infer<typeof foodSchema>>({
        resolver: zodResolver(foodSchema),
        defaultValues: {
            name : "",
            description : "",
            image : "",
            price : "",
            category: [{label : "All",value : "all",fixed : true}]
        },
    })

    useEffect(() => {
      axios.get("/api/category")
          .then(({data}) => {
            const options : Option[] = [];
            data.map((item : object) => {
              options.push({label : item.name,value : item.slug})
              // setValue([...options]);
              setCategoryData([...options]);
            })
          })
          .catch((error) => {
            console.log(error);
          })
    },[])

    function handleDialogChange(isOpen : boolean){
        setOpen(isOpen);
        if(!isOpen){
          foodForm.reset();
        }
    }

    function onSubmit(values: z.infer<typeof foodSchema>) {
        const foodData = {name : values.name,description : values.description,foodImg : values.image,price : values.price,category : values.category};
        // console.log(foodData);
        axios.post("/api/food",foodData)
        .then(({data}) => {
          console.log(data);
          mutate();
          toast.success('food added successfully', {
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
          foodForm.reset();
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
            <Button className={className}>Add Food</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">Add a new food</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center overflow-auto">
              <Form {...foodForm}>
                <form onSubmit={foodForm.handleSubmit(onSubmit)} className="space-y-2 w-[80%] p-2 max-h-[25rem] overflow-auto scrollbar-hide ">
                <FormField
                      control={foodForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Food name</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="samosa" {...field} className="border border-gray-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={foodForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Food description</FormLabel>
                          <FormControl>
                          <Textarea className="border border-gray-500" placeholder="Samosa is a popular savory snack enjoyed across South Asia and beyond." {...field}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={foodForm.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Food image</FormLabel>
                          <FormControl>
                            <Input  type="text" className="border border-gray-500" placeholder="https://cdn-icons-png.flaticon.com/12498883.png" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={foodForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input {...field} className="border border-gray-500" type="text" placeholder="₹250"/>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={foodForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select categories</FormLabel>
                          <FormControl>
                            <MultipleSelector
                              {...field}
                              defaultOptions={categoryData} 
                              placeholder="Select the category for book"
                              className="border border-gray-500"
                            />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="bg-primary shadow-md mt-2">Submit</Button>
                </form>
              </Form>
              </div>
            </DialogContent>
        </Dialog>
        
    )
}