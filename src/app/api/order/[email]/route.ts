import {prisma} from "@/lib/prisma"
import { NextResponse } from "next/server";

interface Params{
    params : {
        email : string;
    }
}

export async function GET(req : Request,{params} : Params){
    const {email} = await params;

    const orderData = await prisma.order.findMany({
        where : {
            user : {
                email : email
            }
        },
        include : {
            user : true,
            food : true
        }
    })

    return NextResponse.json(orderData);
}