# Supabase MCP 토큰 설정 빠른 가이드

## 🔴 현재 상태
- ✅ 패키지: `@supabase/mcp-server-supabase@latest` (설정 완료)
- ❌ 환경 변수: `SUPABASE_ACCESS_TOKEN` 및 `SUPABASE_PROJECT_REF` (설정 필요)

## 📝 설정 파일 위치
```
C:\Users\jongmin\.cursor\mcp.json
```

## 🚀 빠른 설정 가이드

### 1단계: Supabase Personal Access Token 생성

1. **Supabase 대시보드 접속**
   - 브라우저에서 https://supabase.com/dashboard 열기
   - 로그인

2. **Account Preferences 이동**
   - 우측 상단 프로필 아이콘(사진) 클릭
   - 드롭다운에서 **"Account Preferences"** 선택

3. **Access Tokens 메뉴 선택**
   - 왼쪽 사이드바에서 **"Access Tokens"** 클릭

4. **새 토큰 생성**
   - **"Generate New Token"** 버튼 클릭
   - Name 입력 (예: `Cursor MCP Server`)
   - Expiration 설정 (선택사항, 기본값 또는 원하는 만료일)
   - **"Generate Token"** 클릭

5. **토큰 복사 ⚠️ 매우 중요!**
   - 생성된 토큰이 한 번만 표시됩니다
   - **즉시 복사**하세요 (전체 문자열, `sbp_`로 시작)
   - 예: `sbp_1234567890abcdefghijklmnopqrstuvwxyz`

### 2단계: Project Reference ID 확인

1. **프로젝트 선택**
   - Supabase 대시보드에서 사용할 프로젝트 선택

2. **Project REF 찾기**
   - 방법 1: URL에서 확인
     - 브라우저 주소창 확인
     - `https://supabase.com/dashboard/project/`**`여기가_PROJECT_REF`**
   - 방법 2: 프로젝트 설정에서 확인
     - 프로젝트 → Settings → General
     - Reference ID 섹션에서 확인

### 3단계: mcp.json 파일 수정

1. **파일 열기**
   - `C:\Users\jongmin\.cursor\mcp.json` 파일을 텍스트 에디터로 열기
   - Cursor에서 직접 열어도 됩니다

2. **환경 변수 값 입력**
   - 다음 부분을 찾으세요 (17-26줄 근처):
   ```json
   "supabase": {
     "command": "npx",
     "args": [
       "-y",
       "@supabase/mcp-server-supabase@latest"
     ],
     "env": {
       "SUPABASE_ACCESS_TOKEN": "",      // ← 여기에 토큰 붙여넣기
       "SUPABASE_PROJECT_REF": ""        // ← 여기에 프로젝트 ID 입력
     }
   }
   ```

3. **값 입력 예시**
   ```json
   "env": {
     "SUPABASE_ACCESS_TOKEN": "sbp_1234567890abcdefghijklmnopqrstuvwxyz",
     "SUPABASE_PROJECT_REF": "abcdefghijklmnop"
   }
   ```

4. **파일 저장**
   - Ctrl + S (또는 Cmd + S)로 저장

### 4단계: Cursor 재시작

1. **Cursor 완전 종료**
   - 모든 Cursor 창 닫기
   - 작업 관리자에서 Cursor 프로세스가 완전히 종료되었는지 확인 (선택사항)

2. **Cursor 다시 시작**
   - Cursor 실행

3. **확인**
   - Output 탭에서 `Please provide a personal access token` 오류가 사라졌는지 확인
   - MCP 서버 목록에서 Supabase 서버가 녹색으로 표시되는지 확인

## ⚠️ 주의사항

1. **토큰 보안**
   - 토큰은 비밀번호처럼 취급하세요
   - 공개 저장소(GitHub 등)에 업로드하지 마세요
   - `mcp.json` 파일을 `.gitignore`에 추가하는 것을 권장합니다

2. **토큰 형식**
   - Personal Access Token은 `sbp_`로 시작합니다
   - 매우 긴 문자열입니다 (약 40-50자)

3. **프로젝트 REF 형식**
   - 보통 20자 정도의 영숫자 문자열입니다
   - 예: `abcdefghijklmnop`

## ✅ 성공 확인

설정이 올바르게 되었다면:
- ✅ Output 탭에 오류 메시지가 없어야 합니다
- ✅ MCP 서버 상태가 녹색이어야 합니다
- ✅ Supabase 관련 기능이 작동해야 합니다

## 🆘 문제 해결

여전히 오류가 발생한다면:
1. 토큰이 올바르게 복사되었는지 확인 (앞뒤 공백 없이)
2. PROJECT_REF가 올바른지 확인
3. 파일 저장 후 Cursor를 완전히 재시작했는지 확인
4. JSON 형식이 올바른지 확인 (따옴표, 쉼표 등)

## 📚 추가 참고 자료

- [Supabase MCP 공식 문서](https://supabase.com/docs/guides/getting-started/mcp)
- [Personal Access Tokens 문서](https://supabase.com/docs/guides/platform/access-tokens)




