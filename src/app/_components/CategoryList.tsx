"use client"
import { useEffect, useRef, useState } from "react"
import axios from "axios";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

export default function CategoryList(){
    const {data : categoryData,mutate : categoryMutate} = useSWR("/api/category",(url) => axios.get(url).then(({data}) => data))
    const [selectedCategory,setSelectedCategory] = useState("all");
    const [isScrollRight,setIsScrollRight] = useState(false);
    const listRef = useRef(null);
    const params = useSearchParams();

    useEffect(() => {
        setSelectedCategory(params.get("category") || "all")
        categoryMutate();
    },[params])

      const ScrollRightHandler = () => {
        setIsScrollRight(true)
        if(listRef.current){
            listRef.current.scrollBy({
                left : 200,
                behavior : "smooth"
            })
        }
      }

      const ScrollLeftHandler = () => {
        
        if(listRef.current){
            if(listRef.current.scrollLeft < 200){
                setIsScrollRight(false);
            }
            listRef.current.scrollBy({
                left : -200,
                behavior : "smooth"
            })
        }
      }
    return (
        <div className="mt-10 relative">
            {
                isScrollRight &&
                <ArrowLeftCircle onClick={() => ScrollLeftHandler()} className="absolute -left-10 top-9 bg-gray-500 rounded-full text-white h-8 w-8 cursor-pointer"/>
            }
            <div className="flex gap-4 overflow-auto scrollbar-hide" ref={listRef}>
                {
                    categoryData && categoryData.map((category,index) => (
                        <Link href={"?category="+category.slug}  key={index} className={`flex flex-col items-center gap-2 border p-3 rounded-xl min-w-28 hover:border-primary hover:bg-orange-50 cursor-pointer group ${selectedCategory === category.slug && "border-primary bg-orange-50"}`}>
                            <h2 className="text-sm font-medium group-hover:text-primary">{category.name}</h2>
                        </Link>
                    ))
                }
            </div>
            <ArrowRightCircle onClick={() => ScrollRightHandler()} className="absolute -right-10 top-9 bg-gray-500 rounded-full text-white h-8 w-8 cursor-pointer"/>
        </div>
    )
}