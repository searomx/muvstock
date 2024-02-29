import Navigation from "./components/navigation";
import Footer from "./components/navigation/footer";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "App Muvstock",
  description: "Gerenciar download de arquivos",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="pt-br">
      <body className={`flex flex-col min-h-screen ${inter.className}`}>
        <Navigation />
        <ToastContainer />
        {children}
        <Footer />
      </body>
    </html>

  );
}

//inter.className
