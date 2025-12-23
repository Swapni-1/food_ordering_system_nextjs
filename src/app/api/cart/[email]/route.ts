import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"

interface Params{
    params : {
        email : string;
    }
}

export async function GET(req : Request,{params} : Params){
    const {email} = await params;

    const cartData = await prisma.user.findUnique({
        where : {
            email : email
        },
        include : {
            cart : {
                include : {
                    food : true
                }
            }
        }
    });

    return NextResponse.json([...cartData?.cart]);
}

export async function POST(req : Request,{params} : Params){
    const {email} = await params;
    const {foodId} = await req.json();

    const user = await prisma.user.findUnique({where : {email : email},include : {cart : true}});
    const {cart} = user;
    const cartData = cart.filter((item) => item.food_id === foodId);

    if(cartData.length === 0){
        const cartData = await prisma.user.update({
            where : {
                email : email
            },
            data : {
                cart : {
                    create : {
                        food_id :foodId
                    }
                }
            },
            include : {
                cart : true
            }
        })
        return NextResponse.json(cartData);
    }else{
        return NextResponse.json("already exists")
    }
}

export async function DELETE(req : Request,{params} : Params){
        const {email} = await params;

        if(email === "all"){
            const deletedCart = await prisma.cart.deleteMany();
            return NextResponse.json(deletedCart);
        }else{
            const deletedCart = await prisma.cart.delete({
                where : {
                    cart_id : email
                }
            })
            return NextResponse.json(deletedCart);
        }
}