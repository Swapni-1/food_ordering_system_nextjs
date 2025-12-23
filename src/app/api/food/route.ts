import {prisma} from "@/lib/prisma"
import { NextResponse } from "next/server";


export async function GET(){
    const foodData = await prisma.food.findMany({include : {categories : true}});
    return NextResponse.json(foodData);
}


export async function POST(req : Request){
    const {name,description,foodImg,price,category} = await req.json();
    
    const categoryData = category.map((c:object) => {return {slug : c.value}});

    // console.log(categoryData);

    const foodData = await prisma.food.create({
        data : {
            name,
            description,
            foodImg,
            price : parseInt(price),
            categories : {
                connect : categoryData
            }
        },
    })

    return NextResponse.json(foodData);
    // return NextResponse.json({hello : "world"});
}