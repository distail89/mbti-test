import { NextRequest, NextResponse } from 'next/server'
import { generatePersonalityAnalysis } from '@/utils/geminiApi'
import { generateDefaultAnalysis } from '@/utils/defaultAnalysis'
import { AllScoresResult } from '@/utils/calculateScores'

export async function POST(request: NextRequest) {
  try {
    const result: AllScoresResult = await request.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      console.warn('Gemini API 키가 설정되지 않았습니다. 기본 분석을 사용합니다.')
      const defaultAnalysis = generateDefaultAnalysis(result)
      return NextResponse.json({ analysis: defaultAnalysis })
    }

    try {
      const analysis = await generatePersonalityAnalysis(result, apiKey)
      return NextResponse.json({ analysis })
    } catch (error) {
      console.error('Gemini API 오류:', error)
      // API 실패 시에도 기본 분석 제공
      const defaultAnalysis = generateDefaultAnalysis(result)
      return NextResponse.json({ analysis: defaultAnalysis })
    }
  } catch (error) {
    console.error('API 처리 오류:', error)
    return NextResponse.json(
      { error: '분석 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
