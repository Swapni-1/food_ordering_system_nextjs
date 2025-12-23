

import { auth } from "@/auth";
import Auth from "./_components/Authentication";
import Home from "./Home";
import dynamic from "next/dynamic";

// const Auth = dynamic(() => import("./_components/Authentication"),{ssr : false})


export default async function page(){
  const session = await auth();


    return (
      <>
      {
        !session?.user ?
        <Auth/>
        :
        <Home/>
      }
      </>
    )
  

  
}