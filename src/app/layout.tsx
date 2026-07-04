import { fonts } from '@/lib/fonts'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '召物少年-Summoner — AI小说转漫画生成平台',
  description: 'AI驱动的小说转漫画生成平台。输入小说文本，自动生成多风格漫画分格。',
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
