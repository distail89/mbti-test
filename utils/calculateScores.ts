/**
 * MBTI(5차원) 점수 계산 로직 (65문항, 6점 척도)
 * - 핵심 원칙: 각 차원은 "기준(base) 방향" 점수로 통일해서 계산한다.
 * - 문항의 direction(예: E/I)이 base와 다르면 역코딩(7 - 점수)
 * - isReverse는 "검증용(옵션)"으로만 사용 (데이터 오류 탐지)
 */

export interface Question {
  id: number;
  text: string;
  dimension: string;
  direction: string;
  isReverse: boolean;
}

// 1) 차원 정의 (pair + base)
export const DIMENSIONS = ['EI', 'SN', 'TF', 'JP', 'AT'] as const;

export const DIM_PAIR: Record<string, [string, string]> = {
  EI: ['E', 'I'],
  SN: ['S', 'N'],
  TF: ['T', 'F'],
  JP: ['J', 'P'],
  AT: ['A', 'T'],
};

// "percentage는 항상 base 방향의 %"
export const DIM_BASE: Record<string, string> = {
  EI: 'E',
  SN: 'N',
  TF: 'T',
  JP: 'J',
  AT: 'A',
};

function opposite(dimension: string, letter: string): string {
  const [a, b] = DIM_PAIR[dimension];
  return letter === a ? b : a;
}

function clampScore(score: number | null | undefined): number | null {
  if (typeof score !== 'number' || Number.isNaN(score)) return null;
  if (score < 1 || score > 6) return null;
  return score;
}

// 2) 데이터 검증
export function validateQuestions(questions: Question[]): string[] {
  const errors: string[] = [];

  for (const q of questions) {
    if (!DIMENSIONS.includes(q.dimension as any)) {
      errors.push(`[Q${q.id}] dimension 값이 유효하지 않음: ${q.dimension}`);
      continue;
    }

    const [a, b] = DIM_PAIR[q.dimension];
    if (![a, b].includes(q.direction)) {
      errors.push(`[Q${q.id}] direction 값이 유효하지 않음: ${q.direction}`);
    }

    const base = DIM_BASE[q.dimension];
    const shouldBeReverse = q.direction !== base;

    if (typeof q.isReverse === 'boolean' && q.isReverse !== shouldBeReverse) {
      errors.push(
        `[Q${q.id}] isReverse 불일치 (dimension=${q.dimension}, base=${base}, direction=${q.direction})`
      );
    }
  }

  return errors;
}

interface DimensionScoreResult {
  base: string;
  totalScore: number | null;
  percentage: number | null;
  type: string | null;
  answeredCount: number;
  minScore?: number;
  maxScore?: number;
  missingIds?: number[];
  error?: string;
}

interface CalculateOptions {
  requireAllAnswers?: boolean;
  minAnswered?: number;
}

// 3) 차원별 점수 계산
export function calculateDimensionScore(
  dimension: string,
  responses: Record<number, number>,
  questions: Question[],
  opts: CalculateOptions = {}
): DimensionScoreResult {
  const {
    requireAllAnswers = true,
    minAnswered = 13,
  } = opts;

  const dimQuestions = questions.filter((q) => q.dimension === dimension);
  const base = DIM_BASE[dimension];

  let totalScore = 0;
  let answeredCount = 0;

  for (const q of dimQuestions) {
    const raw = responses[q.id];
    const userScore = clampScore(raw);

    if (userScore == null) {
      if (requireAllAnswers) {
        return {
          base,
          totalScore: null,
          percentage: null,
          type: null,
          answeredCount,
          missingIds: dimQuestions
            .filter((x) => clampScore(responses[x.id]) == null)
            .map((x) => x.id),
          error: `응답 누락/오류: ${dimension} 차원에서 점수가 비어있거나(또는 1~6이 아님) 처리 불가`,
        };
      }
      continue;
    }

    const towardBase = q.direction === base;
    totalScore += towardBase ? userScore : 7 - userScore;
    answeredCount += 1;
  }

  if (!requireAllAnswers && answeredCount < minAnswered) {
    return {
      base,
      totalScore: null,
      percentage: null,
      type: null,
      answeredCount,
      error: `${dimension} 차원 응답 수 부족: ${answeredCount}/${dimQuestions.length} (최소 ${minAnswered} 필요)`,
    };
  }

  const minScore = answeredCount * 1;
  const maxScore = answeredCount * 6;
  const percentage = ((totalScore - minScore) / (maxScore - minScore)) * 100;

  const type = percentage >= 50 ? base : opposite(dimension, base);

  return {
    base,
    totalScore,
    percentage,
    type,
    answeredCount,
    minScore,
    maxScore,
  };
}

export interface AllScoresResult {
  mbtiType: string | null;
  dimensions: Record<string, DimensionScoreResult>;
  details: Record<string, string>;
  chartData: Record<
    string,
    {
      [key: string]: number | null;
    }
  >;
  errors: string[];
}

// 4) 전체 계산
export function calculateAllScores(
  responses: Record<number, number>,
  questions: Question[],
  opts: CalculateOptions = {}
): AllScoresResult {
  const results: Record<string, DimensionScoreResult> = {};
  const errors: string[] = [];

  for (const dim of DIMENSIONS) {
    const r = calculateDimensionScore(dim, responses, questions, opts);
    results[dim] = r;
    if (r.error) errors.push(r.error);
  }

  const canCompose = DIMENSIONS.every((dim) => results[dim].type != null);

  const mbtiType = canCompose
    ? `${results.EI.type}${results.SN.type}${results.TF.type}${results.JP.type}-${results.AT.type}`
    : null;

  const details: Record<string, string> = {};
  for (const dim of DIMENSIONS) {
    const r = results[dim];
    const [a, b] = DIM_PAIR[dim];

    if (r.percentage == null) {
      details[dim] = `점수 계산 불가`;
      continue;
    }

    const baseIsA = r.base === a;
    const aPct = baseIsA ? r.percentage : 100 - r.percentage;
    const bPct = 100 - aPct;

    const LABEL: Record<string, Record<string, string>> = {
      EI: { E: 'E(외향성)', I: 'I(내향성)' },
      SN: { S: 'S(감각)', N: 'N(직관)' },
      TF: { T: 'T(사고)', F: 'F(감정)' },
      JP: { J: 'J(판단)', P: 'P(인식)' },
      AT: { A: 'A(주장적)', T: 'T(신중한)' },
    };

    details[dim] = `${LABEL[dim][a]} ${aPct.toFixed(1)}% | ${LABEL[dim][b]} ${bPct.toFixed(1)}%`;
  }

  const chartData: Record<string, { [key: string]: number | null }> = {};
  for (const dim of DIMENSIONS) {
    const r = results[dim];
    const [a, b] = DIM_PAIR[dim];

    if (r.percentage == null) {
      chartData[dim] = { [a]: null, [b]: null };
      continue;
    }

    const baseIsA = r.base === a;
    const aPct = baseIsA ? r.percentage : 100 - r.percentage;
    const bPct = 100 - aPct;
    chartData[dim] = { [a]: +aPct.toFixed(1), [b]: +bPct.toFixed(1) };
  }

  return {
    mbtiType,
    dimensions: results,
    details,
    chartData,
    errors,
  };
}
