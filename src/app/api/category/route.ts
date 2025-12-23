import {prisma} from "@/lib/prisma"
import { NextResponse } from "next/server"
import slugify from "slugify"

export async function GET(){
    const categoryList = await prisma.category.findMany();
    return NextResponse.json(categoryList);
}

export async function POST(req : Request){
    const {name} = await req.json(); 
    const slug = slugify(name,{lower : true,strict : true});

    const categoryData = await prisma.category.create({
        data : {
            name,
            slug
        }
    })

    return NextResponse.json(categoryData);
}