"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/seperator"
import { date } from "@/lib/date"
import { useEffect, useState } from "react"


export default function Order({orderId,date : _Date,totalAmount,delivery,food}){
    
    const [totalFoodAmount,setTotalFoodAmount] = useState(0);

    useEffect(() => {
      if(food){
        let price = 0;
        food.forEach((f) => {
          price += f.price;
        })
        setTotalFoodAmount(price);
      }
    },[])

    return (
        <div className="p-4 flex flex-col gap-2 border border-gray-500/70 rounded-xl cursor-pointer">
            <div>
                <h1 className="font-bold text-lg">{date(_Date)}</h1>
                <div className="flex justify-between items-center">
                    <span className="font-semibold">order id :</span>
                    <span className="font-semibold">{orderId}</span>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                    <span className="font-semibold">Order Total Amount</span>
                    <span className="font-semibold">₹{totalAmount}</span>
                </div>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger><span className="text-primary text-md underline">View Order Detail</span></AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      {
                        food && food.map((f : object,index : number) => 
                          <div key={index} className="flex justify-between">
                            <h2>{f.name}</h2>
                            <h2>₹{f.price}</h2>
                          </div>
                        )
                      }
                      
                      <div className="flex justify-between">
                        <h2>Taxes</h2>
                        <h2>₹{(totalFoodAmount * 8/100).toFixed(2)}</h2>
                      </div>
                      <div className="flex justify-between">
                        <h2>Delivery Charges</h2>
                        <h2>₹{delivery}</h2>
                      </div>
                      <div className="space-y-2">
                        <Separator/>
                        <div className="flex justify-between">
                          <h2 className="font-bold">Total Amount {"(Including taxes + delivery)"} :</h2>
                          <h2 className="font-bold">₹{totalAmount}</h2>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

            </div>
        </div>
    )
}