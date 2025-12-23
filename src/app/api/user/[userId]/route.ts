import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params{
    params : {
        userId : string;
    }
}

export async function GET(req : Request,{params} : Params){
    const {userId} = await params;
    const userData = await prisma.user.findFirst({where : {email : userId}})

    return NextResponse.json(userData);
}

export async function PUT(req : Request,{params} : Params){
    const {userId} = await params;
    const {email,username,password} = await req.json();

    const userData = await prisma.user.update({
        where : {
                    user_id : userId,
        },
        data : {
            username,
            email,
            password
        }
    })

    return NextResponse.json(userData);
}

export async function DELETE(req : Request,{params} : Params){
    const {userId} = await params;

    const userData = await prisma.user.delete({
        where : {
            user_id : userId
        }
    })

    return NextResponse.json(userData);
}