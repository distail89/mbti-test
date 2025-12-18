'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import questionsData from '@/data/mbti_questions.json'
import { shuffleQuestions, Question } from '@/utils/shuffleQuestions'

const SCALE_LABELS = [
  '매우 아니다',
  '아니다',
  '약간 아니다',
  '약간 그렇다',
  '그렇다',
  '매우 그렇다',
]

export default function TestPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Record<number, number>>({})

  useEffect(() => {
    const shuffled = shuffleQuestions(questionsData as Question[], 2)
    setQuestions(shuffled)
    
    // localStorage에서 이전 응답 복원
    const saved = localStorage.getItem('mbti_responses')
    if (saved) {
      setResponses(JSON.parse(saved))
    }
  }, [])

  const currentQuestion = questions[currentIndex]
  const currentResponse = responses[currentQuestion?.id]
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0
  const answeredCount = Object.keys(responses).length

  const handleAnswer = (score: number) => {
    const newResponses = {
      ...responses,
      [currentQuestion.id]: score,
    }
    setResponses(newResponses)
    localStorage.setItem('mbti_responses', JSON.stringify(newResponses))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // 모든 질문 완료
      router.push('/loading')
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">질문을 불러오는 중...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* 진행 바 */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>질문 {currentIndex + 1} / {questions.length}</span>
            <span>응답 완료: {answeredCount} / {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 질문 카드 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-12">
            {currentQuestion.text}
          </h2>

          {/* 6점 척도 버튼 */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6].map((score) => (
              <button
                key={score}
                onClick={() => handleAnswer(score)}
                className={`
                  py-4 px-2 rounded-lg font-medium transition-all duration-200
                  ${
                    currentResponse === score
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <div className="text-2xl font-bold mb-1">{score}</div>
                <div className="text-xs">{SCALE_LABELS[score - 1]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all
              ${
                currentIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }
            `}
          >
            이전
          </button>

          <button
            onClick={handleNext}
            disabled={!currentResponse}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all
              ${
                currentResponse
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {currentIndex === questions.length - 1 ? '결과 보기' : '다음'}
          </button>
        </div>
      </div>
    </main>
  )
}
