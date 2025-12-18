'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { AllScoresResult } from '@/utils/calculateScores'

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<AllScoresResult | null>(null)
  const [analysis, setAnalysis] = useState<string>('')

  useEffect(() => {
    const resultData = sessionStorage.getItem('mbti_result')
    const analysisData = sessionStorage.getItem('mbti_analysis')

    if (!resultData) {
      router.push('/')
      return
    }

    setResult(JSON.parse(resultData))
    setAnalysis(analysisData || '분석 결과를 불러올 수 없습니다.')
  }, [router])

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">결과를 불러오는 중...</div>
      </div>
    )
  }

  const { mbtiType, chartData } = result

  // 차원별 차트 렌더링
  const renderDimensionChart = (
    dimension: string,
    labels: { left: string; right: string }
  ) => {
    const data = chartData[dimension]
    const leftKey = Object.keys(data)[0]
    const rightKey = Object.keys(data)[1]
    const leftValue = data[leftKey] || 0
    const rightValue = data[rightKey] || 0

    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2 text-sm font-medium text-gray-700">
          <span>{labels.left}</span>
          <span>{labels.right}</span>
        </div>
        <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-end pr-2 text-white text-xs font-semibold"
            style={{ width: `${leftValue}%` }}
          >
            {leftValue > 10 && `${leftValue.toFixed(1)}%`}
          </div>
          <div
            className="absolute right-0 top-0 h-full bg-gradient-to-l from-purple-500 to-purple-400 flex items-center justify-start pl-2 text-white text-xs font-semibold"
            style={{ width: `${rightValue}%` }}
          >
            {rightValue > 10 && `${rightValue.toFixed(1)}%`}
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* MBTI 유형 배지 */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-4xl font-bold px-8 py-4 rounded-2xl shadow-lg mb-4">
            {mbtiType}
          </div>
        </div>

        {/* 차원별 차트 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📊 차원별 분석
          </h2>

          {renderDimensionChart('EI', {
            left: 'E(외향성)',
            right: 'I(내향성)',
          })}

          {renderDimensionChart('SN', {
            left: 'S(감각)',
            right: 'N(직관)',
          })}

          {renderDimensionChart('TF', {
            left: 'T(사고)',
            right: 'F(감정)',
          })}

          {renderDimensionChart('JP', {
            left: 'J(판단)',
            right: 'P(인식)',
          })}

          {renderDimensionChart('AT', {
            left: 'A(주장적)',
            right: 'T(신중한)',
          })}
        </div>

        {/* Gemini 분석 결과 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-strong:text-gray-800 prose-code:text-purple-600">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold mb-4 text-gray-800" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-4 text-gray-700 leading-relaxed" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="ml-4" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold text-gray-800" {...props} />
                ),
                hr: ({ node, ...props }) => (
                  <hr className="my-8 border-gray-300" {...props} />
                ),
              }}
            >
              {analysis}
            </ReactMarkdown>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/test"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-center"
            onClick={() => {
              localStorage.removeItem('mbti_responses')
              sessionStorage.removeItem('mbti_result')
              sessionStorage.removeItem('mbti_analysis')
            }}
          >
            다시 검사하기
          </Link>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `내 MBTI 유형: ${mbtiType}`,
                  text: `32가지 MBTI 성격유형 검사 결과`,
                  url: window.location.href,
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
                alert('링크가 클립보드에 복사되었습니다!')
              }
            }}
            className="bg-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            결과 공유하기
          </button>

          <Link
            href="/"
            className="bg-gray-100 text-gray-600 font-semibold px-8 py-3 rounded-lg shadow hover:shadow-lg transition-all duration-200 text-center"
          >
            홈으로
          </Link>
        </div>
      </div>
    </main>
  )
}
