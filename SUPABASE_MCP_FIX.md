# Supabase MCP 오류 해결 가이드

## 문제 분석

현재 `mcp-supabase-db` 패키지를 사용할 때 다음과 같은 오류가 발생합니다:

1. **npm 오류**: `npm error could not determine executable to run`
   - npx가 실행 파일을 찾지 못함
   
2. **모듈 오류**: `ERR_MODULE_NOT_FOUND: Cannot find module '...pluginSystem.js'`
   - 패키지 설치 후에도 모듈을 찾을 수 없는 버그 존재

## 해결 방법

### 방법 1: 공식 Supabase MCP 패키지 사용 (권장)

Supabase 공식 패키지인 `@supabase/mcp-server-supabase`를 사용하는 것이 더 안정적입니다.

#### Cursor MCP 설정 변경

1. Cursor에서 **Settings** → **Features** → **MCP**로 이동
2. 기존 `mcp-supabase-db` 설정을 찾거나 새로 추가
3. 다음 설정으로 변경:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "your-access-token-here",
        "SUPABASE_PROJECT_REF": "your-project-ref-here"
      }
    }
  }
}
```

#### 필수 환경 변수

**⚠️ 현재 오류**: `Please provide a personal access token (PAT)` - 환경 변수 설정이 필요합니다!

##### 1. SUPABASE_ACCESS_TOKEN 생성 및 설정

1. **Supabase 대시보드 접속**
   - https://supabase.com/dashboard 에 로그인

2. **Account Preferences로 이동**
   - 우측 상단 프로필 이미지 클릭 → **Account Preferences** 선택

3. **Access Tokens 메뉴**
   - 왼쪽 사이드바에서 **Access Tokens** 클릭

4. **새 토큰 생성**
   - **Generate New Token** 버튼 클릭
   - 토큰 이름 입력 (예: "Cursor MCP Server")
   - 만료 기간 설정 (선택사항)
   - **Generate Token** 클릭

5. **토큰 복사**
   - ⚠️ **중요**: 생성된 토큰을 즉시 복사하세요. 다시 볼 수 없습니다!
   - `mcp.json` 파일의 `"SUPABASE_ACCESS_TOKEN": ""` 부분에 복사한 토큰을 붙여넣기

##### 2. SUPABASE_PROJECT_REF 확인 및 설정

1. **Supabase 프로젝트로 이동**
   - 대시보드에서 사용할 프로젝트 선택

2. **프로젝트 참조 ID 확인**
   - 프로젝트 설정 페이지 또는 URL에서 확인
   - URL 예시: `https://supabase.com/dashboard/project/`**`abcdefghijklmnop`**
     - 이 부분이 PROJECT_REF입니다

3. **설정 파일에 추가**
   - `mcp.json` 파일의 `"SUPABASE_PROJECT_REF": ""` 부분에 프로젝트 참조 ID를 입력

#### 추가 옵션

읽기 전용 모드로 실행하려면:

```json
{
  "args": [
    "-y",
    "@supabase/mcp-server-supabase@latest",
    "--read-only"
  ]
}
```

### 방법 2: mcp-supabase-db 패키지 사용 (문제 해결 필요)

현재 `mcp-supabase-db@3.3.1` 패키지에는 모듈 로딩 버그가 있습니다. 

#### 임시 해결책

1. 패키지를 로컬에 설치 후 직접 실행:

```bash
npm install mcp-supabase-db@latest
npx supabase-db-mcp
```

2. 또는 Cursor 설정에서 전체 경로 사용:

```json
{
  "command": "node",
  "args": [
    "node_modules/.bin/supabase-db-mcp"
  ]
}
```

하지만 이 방법도 모듈 오류가 발생할 수 있으므로 권장하지 않습니다.

## 권장 사항

**Supabase 공식 패키지(`@supabase/mcp-server-supabase`) 사용을 강력히 권장합니다.**

이유:
- ✅ Supabase 팀에서 공식 지원
- ✅ 최신 버전 (v0.5.10, 2025-12-16 업데이트)
- ✅ 안정적인 동작 확인
- ✅ 정기적인 업데이트 및 버그 수정

## 단계별 설정 가이드

### 현재 상태
- ✅ 패키지 교체 완료: `mcp-supabase-db` → `@supabase/mcp-server-supabase@latest`
- ⚠️ 환경 변수 설정 필요: `SUPABASE_ACCESS_TOKEN` 및 `SUPABASE_PROJECT_REF`

### 설정 파일 위치
`C:\Users\jongmin\.cursor\mcp.json`

### 설정 예시

환경 변수를 설정한 후 다음과 같이 보여야 합니다:

```json
"supabase": {
  "command": "npx",
  "args": [
    "-y",
    "@supabase/mcp-server-supabase@latest"
  ],
  "env": {
    "SUPABASE_ACCESS_TOKEN": "sbp_your_actual_token_here",
    "SUPABASE_PROJECT_REF": "abcdefghijklmnop"
  }
}
```

### 확인 사항

설정 변경 후:
1. **파일 저장**: `mcp.json` 파일을 저장하세요
   
2. **Cursor 재시작**: 설정 변경 사항을 적용하려면 Cursor를 완전히 종료 후 다시 시작하세요.

3. **MCP 서버 상태 확인**: 
   - Cursor의 MCP 서버 목록에서 Supabase 서버가 녹색 표시(정상 연결)되는지 확인
   - Output 탭에서 오류 메시지가 사라졌는지 확인
   - `Please provide a personal access token` 오류가 사라져야 합니다

4. **Supabase 관련 기능 테스트**

## 참고 자료

- [Supabase MCP 공식 문서](https://supabase.com/docs/guides/getting-started/mcp)
- [공식 패키지 npm 페이지](https://www.npmjs.com/package/@supabase/mcp-server-supabase)








