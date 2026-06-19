import { fonts } from '@/lib/fonts'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '召物少年-Summoner: generate your own comics! Powered by Hugging Face 🤗',
  description: 'Generate comic panels using a LLM + SDXL. Powered by Hugging Face 🤗',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={fonts.actionman.className}>
        {children}
      </body>
    </html>
  )
}
