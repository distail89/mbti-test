import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '32가지 MBTI 성격유형 검사',
  description: '당신의 성격 유형을 알아보는 심리 검사',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
