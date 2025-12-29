iimport { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {Role} from "@prisma/client"

export async function GET(){

    const user = await prisma.user.findMany({where :{NOT : {role : Role.ADMIN}}});

    return NextResponse.json(user);
}

export async function POST(req : Request){
    const {username,email,password} = await req.json();

    const userData = await prisma.user.create({
        data : {
            username,
            email,
            password
        }
    })

    return NextResponse.json(userData);
}
