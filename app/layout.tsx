import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import { CartProvider } from "@/contexts/cart-context"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "PetCare Accessories - Accessoires Premium pour Animaux",
  description:
    "Découvrez notre collection d'accessoires haut de gamme pour chiens et chats. Colliers, jouets, gamelles et plus encore.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
