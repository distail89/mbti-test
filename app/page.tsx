'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          32가지 MBTI 성격유형 검사
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          당신의 성격을 65문항으로 분석하고<br />
          AI가 개인화된 해석을 제공합니다
        </p>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">검사 안내</h2>
          
          <ul className="text-left space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>총 65문항, 약 10-15분 소요</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>6점 척도로 응답 (1=매우 아니다 ~ 6=매우 그렇다)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>5개 차원으로 성격 분석 (EI, SN, TF, JP, AT)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span>Gemini AI가 개인화된 상세 해석 제공</span>
            </li>
          </ul>
        </div>

        <Link
          href="/test"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-semibold px-12 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          검사 시작하기
        </Link>

        <p className="text-sm text-gray-500 mt-4">
          * 이 검사는 심리학적 진단 도구가 아닙니다
        </p>
      </div>
    </main>
  )
}
