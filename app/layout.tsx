import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smart Ilha - Especialistas em Smartwatches",
  description:
    "Descubra os melhores smartwatches com atendimento personalizado e garantia de qualidade. Mais de 2.400 pedidos entregues e 2 anos no mercado.",
  keywords: "smartwatch, relógio inteligente, tecnologia, ilha do governador, entrega rápida",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
