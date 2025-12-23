import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Provider from "@/Provider";
import {ToastContainer,Bounce} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import {SessionProvider} from "next-auth/react"
import {auth} from "@/auth"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NEats",
  description: "We love to serve the customer with a kind heart.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > 
        <SessionProvider session={session}>
          
            <Provider>
              <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
              />
              {children}
            </Provider>
        
        </SessionProvider>
        
      </body>
    </html>
  );
}
