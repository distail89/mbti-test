# Task Master AI 오류 해결 가이드

## 문제 분석

`task-master-ai` 실행 중 다음과 같은 오류가 발생했습니다:

1. **초기 오류**: `ERR_MODULE_NOT_FOUND: Cannot find module 'zod/v4/locales/sl.js'`
   - `zod` 패키지의 로케일 파일 누락 문제

2. **npm 캐시 오류**: `npm warn tar TAR_ENTRY_ERROR`
   - `ENOENT: no such file or directory` 오류 다수 발생
   - `npx` 캐시 디렉토리에서 파일 시스템 문제 발생

## 해결 방법

### 1. 설정 파일 업데이트 완료 ✅

`task-master-ai`를 최신 안정 버전(`0.39.0`)으로 고정했습니다.

**설정 파일 위치**: `C:\Users\jongmin\.cursor\mcp.json`

```json
"task-master-ai": {
  "command": "npx",
  "args": [
    "-y",
    "task-master-ai@0.39.0"
  ],
  "env": {
    "ANTHROPIC_API_KEY": ""
  }
}
```

### 2. npm 캐시 정리 완료 ✅

`npm cache clean --force` 명령으로 npm 캐시를 정리했습니다.

### 3. npx 캐시 수동 정리 (필요시)

npm 캐시 오류가 지속되는 경우, 다음 단계를 수행하세요:

#### 방법 1: PowerShell에서 npx 캐시 디렉토리 삭제

1. **PowerShell을 관리자 권한으로 실행**
2. 다음 명령 실행:

```powershell
# npx 캐시 디렉토리 확인
$npxCache = "$env:LOCALAPPDATA\npm-cache\_npx"
if (Test-Path $npxCache) {
    Write-Host "npx 캐시 디렉토리 발견: $npxCache"
    Write-Host "삭제를 진행합니다..."
    
    # 모든 프로세스 종료 후 삭제 시도
    Get-ChildItem -Path $npxCache -Recurse | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
    Remove-Item -Path $npxCache -Force -Recurse -ErrorAction SilentlyContinue
    
    Write-Host "npx 캐시 정리 완료"
} else {
    Write-Host "npx 캐시 디렉토리가 없습니다"
}
```

#### 방법 2: 파일 탐색기에서 수동 삭제

1. **Windows 탐색기 열기**
2. 주소창에 다음 경로 입력:
   ```
   %LOCALAPPDATA%\npm-cache\_npx
   ```
3. **Enter 키**를 눌러 해당 디렉토리로 이동
4. **Ctrl + A**로 모든 파일 선택
5. **Shift + Delete**로 완전 삭제 (휴지통 거치지 않음)

⚠️ **주의**: 삭제 전에 Cursor와 다른 Node.js 프로세스를 모두 종료하세요.

### 4. Cursor 재시작

1. **Cursor 완전 종료**
   - 모든 Cursor 창 닫기
   - 작업 관리자에서 Cursor 프로세스 확인

2. **Cursor 다시 시작**

3. **MCP 서버 상태 확인**
   - Output 탭에서 오류 메시지 확인
   - MCP 서버 목록에서 `task-master-ai` 상태 확인

## 추가 문제 해결

### 문제가 지속되는 경우

#### 옵션 1: 다른 안정 버전 시도

`0.39.0`에서 문제가 발생하면 이전 안정 버전을 시도해보세요:

```json
"task-master-ai": {
  "command": "npx",
  "args": [
    "-y",
    "task-master-ai@0.36.0"
  ],
  "env": {
    "ANTHROPIC_API_KEY": ""
  }
}
```

#### 옵션 2: 일시적으로 비활성화

문제 해결이 어려운 경우, MCP 설정에서 `task-master-ai` 섹션을 주석 처리하거나 제거할 수 있습니다:

```json
// "task-master-ai": {
//   "command": "npx",
//   "args": [
//     "-y",
//     "task-master-ai@0.39.0"
//   ],
//   "env": {
//     "ANTHROPIC_API_KEY": ""
//   }
// }
```

#### 옵션 3: 전역 설치 후 사용

`npx` 대신 전역 설치를 사용하는 방법:

```bash
npm install -g task-master-ai@0.39.0
```

그리고 MCP 설정을 다음과 같이 변경:

```json
"task-master-ai": {
  "command": "task-master-ai",
  "args": [],
  "env": {
    "ANTHROPIC_API_KEY": ""
  }
}
```

## 확인 사항

설정이 올바르게 적용되었는지 확인:

- ✅ `mcp.json` 파일이 올바르게 저장되었는지 확인
- ✅ Cursor를 완전히 재시작했는지 확인
- ✅ Output 탭에서 오류 메시지가 사라졌는지 확인
- ✅ MCP 서버 목록에서 `task-master-ai`가 정상 상태인지 확인

## 참고 자료

- [Task Master AI GitHub](https://github.com/eyaltoledano/claude-task-master)
- [npm 패키지 페이지](https://www.npmjs.com/package/task-master-ai)
- [최신 버전 정보](https://www.npmjs.com/package/task-master-ai/v/0.39.0)

## 현재 상태

- ✅ 설정 파일 업데이트 완료 (`task-master-ai@0.39.0`)
- ✅ npm 캐시 정리 완료
- ⚠️ npx 캐시 수동 정리 필요 (문제 지속 시)
- ⚠️ Cursor 재시작 필요


