import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";

interface Params{
    params : {
        categoryId : string;
    }
}


export async function PUT(req : Request,{params} : Params){
    const {categoryId} = await params;
    const {name} = await req.json();
    const slug = slugify(name,{lower : true,strict : true})

    const categoryData = await prisma.category.update({
        where : {
            category_id : categoryId
        },
        data : {
            name,
            slug
        }
    })

    return NextResponse.json(categoryData);
}

export async function DELETE(req : Request,{params} : Params){
    const {categoryId} = await params;
    const categoryData = await prisma.category.delete({
        where : {
            category_id : categoryId
        }
    })

    return NextResponse.json(categoryData);
}