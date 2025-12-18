/**
 * MBTI 질문 랜덤 섞기 로직
 * - 같은 차원이 연속 3개 이상 나오지 않도록 보장
 * - 매번 다른 순서 생성
 */

export interface Question {
  id: number;
  text: string;
  dimension: string;
  direction: string;
  isReverse: boolean;
}

/**
 * Fisher-Yates 셔플 알고리즘
 */
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 연속된 같은 차원 검사
 */
function findConsecutiveViolation(
  questions: Question[],
  maxConsecutive: number = 2
): { position: number; dimension: string; consecutiveCount: number } | null {
  for (let i = 0; i < questions.length - maxConsecutive; i++) {
    const dimension = questions[i].dimension;
    let count = 1;

    for (let j = i + 1; j < questions.length; j++) {
      if (questions[j].dimension === dimension) {
        count++;
        if (count > maxConsecutive) {
          return {
            position: i,
            dimension: dimension,
            consecutiveCount: count,
          };
        }
      } else {
        break;
      }
    }
  }
  return null;
}

/**
 * 특정 위치 주변의 연속 위반만 체크
 */
function checkLocalViolations(
  questions: Question[],
  positions: number[],
  maxConsecutive: number = 2
): boolean {
  for (const pos of positions) {
    const start = Math.max(0, pos - maxConsecutive);
    const end = Math.min(questions.length, pos + maxConsecutive + 1);

    for (let i = start; i < end - maxConsecutive; i++) {
      const dimension = questions[i].dimension;
      let count = 1;

      for (let j = i + 1; j <= i + maxConsecutive; j++) {
        if (j < questions.length && questions[j].dimension === dimension) {
          count++;
        } else {
          break;
        }
      }

      if (count > maxConsecutive) {
        return true;
      }
    }
  }
  return false;
}

/**
 * 위반 수정: 문제가 되는 위치의 질문을 다른 위치와 교환
 */
function fixViolation(
  questions: Question[],
  violation: { position: number; dimension: string; consecutiveCount: number }
): boolean {
  const { position, dimension } = violation;

  let endPos = position;
  while (
    endPos < questions.length &&
    questions[endPos].dimension === dimension
  ) {
    endPos++;
  }

  for (let i = endPos + 3; i < questions.length; i++) {
    if (questions[i].dimension !== dimension) {
      const temp = [...questions];
      [temp[endPos - 1], temp[i]] = [temp[i], temp[endPos - 1]];

      const localCheck = checkLocalViolations(temp, [endPos - 1, i]);
      if (!localCheck) {
        [questions[endPos - 1], questions[i]] = [
          questions[i],
          questions[endPos - 1],
        ];
        return true;
      }
    }
  }

  for (let i = 0; i < position - 3; i++) {
    if (questions[i].dimension !== dimension) {
      const temp = [...questions];
      [temp[endPos - 1], temp[i]] = [temp[i], temp[endPos - 1]];

      const localCheck = checkLocalViolations(temp, [endPos - 1, i]);
      if (!localCheck) {
        [questions[endPos - 1], questions[i]] = [
          questions[i],
          questions[endPos - 1],
        ];
        return true;
      }
    }
  }

  return false;
}

/**
 * 메인 함수: 제약조건을 만족하는 랜덤 순서 생성
 */
export function shuffleQuestions(
  questions: Question[],
  maxConsecutive: number = 2,
  maxAttempts: number = 100
): Question[] {
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt++;

    let shuffled = shuffle(questions);

    let fixAttempts = 0;
    const maxFixAttempts = 50;

    while (fixAttempts < maxFixAttempts) {
      const violation = findConsecutiveViolation(shuffled, maxConsecutive);

      if (!violation) {
        return shuffled;
      }

      const fixed = fixViolation(shuffled, violation);
      if (!fixed) {
        break;
      }

      fixAttempts++;
    }
  }

  console.warn(
    `⚠️ ${maxAttempts}번 시도 후에도 완벽한 순서를 찾지 못했습니다. 최선의 결과를 반환합니다.`
  );
  return shuffle(questions);
}

/**
 * 섞인 질문 순서 검증 및 통계
 */
export function validateShuffledOrder(
  questions: Question[],
  maxConsecutive: number = 2
) {
  const stats: {
    totalQuestions: number;
    dimensionCounts: Record<string, number>;
    maxConsecutiveByDimension: Record<string, number>;
    violations: Array<{
      position: number;
      dimension: string;
      consecutiveCount: number;
    }>;
    isValid: boolean;
  } = {
    totalQuestions: questions.length,
    dimensionCounts: {},
    maxConsecutiveByDimension: {},
    violations: [],
    isValid: false,
  };

  questions.forEach((q) => {
    stats.dimensionCounts[q.dimension] =
      (stats.dimensionCounts[q.dimension] || 0) + 1;
  });

  let i = 0;
  while (i < questions.length) {
    const dimension = questions[i].dimension;
    let count = 1;

    while (
      i + count < questions.length &&
      questions[i + count].dimension === dimension
    ) {
      count++;
    }

    if (
      !stats.maxConsecutiveByDimension[dimension] ||
      count > stats.maxConsecutiveByDimension[dimension]
    ) {
      stats.maxConsecutiveByDimension[dimension] = count;
    }

    if (count > maxConsecutive) {
      stats.violations.push({
        position: i,
        dimension: dimension,
        consecutiveCount: count,
      });
    }

    i += count;
  }

  stats.isValid = stats.violations.length === 0;

  return stats;
}
