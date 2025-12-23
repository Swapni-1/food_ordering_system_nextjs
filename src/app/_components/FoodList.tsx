"use client"
import { useEffect, useState } from "react"
import FoodItem from "./FoodItem"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import axios from "axios"
import { useSearchStore } from "../_hooks/useSearch"


export default function FoodList(){

    const params = useSearchParams();
    const {data : foodData,mutate : foodMutate} = useSWR(`/api/food/${params.get("category") || "all"}`,(url) => axios.get(url).then(({data}) => data))

    useEffect(() => {
        foodMutate();
    },[params])

    return (
        <div className="mt-5">
            <div className="grid lg:grid-cols-[repeat(2,1fr)] sm:grid-cols-1 gap-5 mt-5">
                {
                    foodData && foodData.map((food,index : number) => (
                        <FoodItem key={index} src={food.foodImg} name={food.name} price={food.price} description={food.description} foodId={food.food_id}/>
                    ))
                }
            </div>
        </div>
        
    )
}