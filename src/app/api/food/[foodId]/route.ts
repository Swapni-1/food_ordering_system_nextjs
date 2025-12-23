import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params{
    params : {
        foodId :string;
    }
}

export async function GET(req : Request,{params} : Params){
    const {foodId} = await params;

    const foodData = await prisma.food.findMany({
        where : {
            OR : [
                {
                    food_id : foodId
                },
                {
                    categories : {
                        some : {
                            slug : foodId
                        }
                    }
                }
            ]
        },
        include : {
            categories : true
        }
    })

    return NextResponse.json(foodData);
}

export async function PUT(req : Request,{params} : Params){
    const {name,description,foodImg,price,category} = await req.json();
    const {foodId} = await params;

    const categoryData = category.map((c:object) => {return {slug : c.value}});

    const foodData = await prisma.food.update({
        where : {
            food_id : foodId
        },
        data : {
            name,
            description,
            foodImg,
            price : parseInt(price),
            categories : {
                connect : categoryData
            }
        },
        include : {
            categories : true
        }
    })

    return NextResponse.json(foodData);
}

export async function DELETE(req : Request,{params} : Params){
    const {foodId} = await params;
    const foodData = await prisma.food.delete({
        where : {
            food_id : foodId
        }
    })

    return NextResponse.json(foodData);
}