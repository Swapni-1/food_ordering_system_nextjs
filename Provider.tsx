'use client'
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import React from "react"

export default function Provider({children} : React.PropsWithChildren){
    return (
        <div className="">
            <PayPalScriptProvider options={{clientId : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string}}>
                {children}
            </PayPalScriptProvider>
        </div>
    )
}