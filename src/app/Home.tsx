"use client"
import CategoryList from "./_components/CategoryList"
import Header from "@/app/_components/Header";
import FoodList from "./_components/FoodList";

export default function Home(){
    return (
        <div className="px-10 md:px-20 relative">
            <Header/>
            <CategoryList/>
            <FoodList/>
        </div>
    )
}