

import { auth } from "@/auth";
import Auth from "./_components/Authentication";
import Home from "./Home";

// const Auth = dynamic(() => import("./_components/Authentication"),{ssr : false})

export const dynamic = 'force-dynamic';

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