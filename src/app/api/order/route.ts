import {prisma} from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET(){
    const orderData = await prisma.order.findMany({include : {user : true,food: true}});

    return NextResponse.json(orderData);
}

export async function POST(req : Request){
    const {email,cart,amount} = await req.json();
    const orderData = await prisma.order.create({
        data : {
            user : {
                connect : {
                    email : email as string
                }
            },
            food : {
                connect : cart.map((c : object) => {return {food_id : c.food.food_id}})
            },
            amount : parseInt(amount)
        },
    })

    return NextResponse.json(orderData);
}

export async function DELETE(){
    const deletedOrder = await prisma.order.deleteMany();

    return NextResponse.json(deletedOrder);
}