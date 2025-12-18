'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { calculateAllScores } from '@/utils/calculateScores'
import { generateFallbackMessage } from '@/utils/geminiApi'
import questionsData from '@/data/mbti_questions.json'
import { Question } from '@/utils/shuffleQuestions'

export default function LoadingPage() {
  const router = useRouter()
  const [status, setStatus] = useState('점수를 계산하는 중...')

  useEffect(() => {
    const processResults = async () => {
      try {
        // 1. localStorage에서 응답 가져오기
        const saved = localStorage.getItem('mbti_responses')
        if (!saved) {
          router.push('/test')
          return
        }

        const responses: Record<number, number> = JSON.parse(saved)

        // 2. 점수 계산
        setStatus('점수를 계산하는 중...')
        const result = calculateAllScores(
          responses,
          questionsData as Question[],
          { requireAllAnswers: true }
        )

        if (!result.mbtiType) {
          throw new Error('점수 계산 실패')
        }

        // 3. 결과를 sessionStorage에 저장
        sessionStorage.setItem('mbti_result', JSON.stringify(result))

        // 4. Gemini API 호출 (서버 사이드)
        setStatus('AI가 개인화된 분석을 생성하는 중...')
        
        try {
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(result),
          })

          if (!response.ok) {
            throw new Error('API 호출 실패')
          }

          const data = await response.json()
          sessionStorage.setItem('mbti_analysis', data.analysis)
        } catch (error) {
          console.error('Gemini API 오류:', error)
          const fallback = generateFallbackMessage(result)
          sessionStorage.setItem('mbti_analysis', fallback)
        }

        // 5. 결과 페이지로 이동
        router.push('/results')
      } catch (error) {
        console.error('처리 중 오류:', error)
        router.push('/test')
      }
    }

    processResults()
  }, [router])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800">
          {status}
        </h2>
        
        <p className="text-gray-600">
          잠시만 기다려주세요...
        </p>
      </div>
    </main>
  )
}
