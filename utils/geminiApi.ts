/**
 * Gemini API 호출
 * 사용자의 검사 결과를 받아서 개인화된 해석 생성
 */

import { GEMINI_SYSTEM_PROMPT } from './geminiPrompt';
import { AllScoresResult } from './calculateScores';

/**
 * 사용자 프롬프트 생성
 */
export function generateUserPrompt(result: AllScoresResult): string {
  const { mbtiType, chartData } = result;

  return `
다음 사용자의 MBTI 검사 결과를 분석하여 개인화된 성격 해석을 생성해주세요.

## 검사 결과

**MBTI 유형**: ${mbtiType}

**차원별 비율**:
- E(외향성): ${chartData.EI.E}% | I(내향성): ${chartData.EI.I}%
- S(감각): ${chartData.SN.S}% | N(직관): ${chartData.SN.N}%
- T(사고): ${chartData.TF.T}% | F(감정): ${chartData.TF.F}%
- J(판단): ${chartData.JP.J}% | P(인식): ${chartData.JP.P}%
- A(주장적): ${chartData.AT.A}% | T(신중한): ${chartData.AT.T}%

## 요구사항

위 비율을 **정확히** 반영하여, 시스템 프롬프트에 제시된 형식대로 상세한 성격 분석을 작성해주세요.

특히 주의할 점:
1. 각 차원의 강도(약함/중간/강함)를 퍼센트에 맞게 표현
2. 행동 패턴은 구체적이고 실생활 기반으로
3. 친근하면서도 전문적인 톤 유지
4. 강점과 주의점의 균형
5. 이모지는 적절히 사용 (과하지 않게)
`;
}

/**
 * Gemini API 호출
 */
export async function generatePersonalityAnalysis(
  result: AllScoresResult,
  apiKey: string
): Promise<string> {
  const userPrompt = generateUserPrompt(result);

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: GEMINI_SYSTEM_PROMPT + '\n\n' + userPrompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096,
    },
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Gemini API 오류: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    return generatedText;
  } catch (error) {
    console.error('Gemini API 호출 실패:', error);
    throw error;
  }
}

/**
 * Gemini API 실패 시 폴백 메시지
 */
export function generateFallbackMessage(result: AllScoresResult): string {
  const { mbtiType, details } = result;

  return `
# 당신의 성격 유형: ${mbtiType}

죄송합니다. 현재 상세 분석을 생성할 수 없습니다.
잠시 후 다시 시도해주세요.

## 기본 결과

${Object.values(details).join('\n')}

더 자세한 분석을 원하시면 페이지를 새로고침해주세요.
`;
}
