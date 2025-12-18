# 🚀 배포 가이드 - 다른 PC에서 접속하기

다른 PC나 모바일에서 접속할 수 있도록 웹에 배포하는 방법입니다.

## 📋 배포 옵션 비교

| 플랫폼 | 무료 플랜 | 난이도 | 추천도 | 특징 |
|--------|----------|--------|--------|------|
| **Vercel** | ✅ 있음 | ⭐ 쉬움 | ⭐⭐⭐⭐⭐ | Next.js 공식, 자동 배포 |
| **Netlify** | ✅ 있음 | ⭐ 쉬움 | ⭐⭐⭐⭐ | 간단한 설정 |
| **Railway** | ✅ 있음 | ⭐⭐ 보통 | ⭐⭐⭐ | 유연한 설정 |
| **Render** | ✅ 있음 | ⭐⭐ 보통 | ⭐⭐⭐ | 안정적 |

---

## 🎯 방법 1: Vercel 배포 (가장 추천 ⭐)

Vercel은 Next.js를 만든 회사에서 제공하는 플랫폼으로, 가장 간단하고 빠릅니다.

### 1단계: Vercel 계정 생성

1. https://vercel.com 접속
2. **Sign Up** 클릭
3. GitHub 계정으로 로그인 (권장) 또는 이메일로 가입

### 2단계: 프로젝트 배포

#### 방법 A: Vercel CLI 사용 (권장)

```bash
# 1. Vercel CLI 설치
npm install -g vercel

# 2. 프로젝트 디렉토리로 이동
cd "c:\Users\jongmin\.cursor\projects\MBTI"

# 3. Vercel 로그인
vercel login

# 4. 프로젝트 배포
vercel

# 질문에 답변:
# - Set up and deploy? → Y
# - Which scope? → 본인 계정 선택
# - Link to existing project? → N
# - Project name? → mbti-test (또는 원하는 이름)
# - Directory? → ./
# - Override settings? → N
```

#### 방법 B: GitHub 연동 (자동 배포)

1. **GitHub에 코드 업로드**
   ```bash
   # Git 초기화 (아직 안 했다면)
   git init
   git add .
   git commit -m "Initial commit"
   
   # GitHub 저장소 생성 후
   git remote add origin https://github.com/your-username/mbti-test.git
   git push -u origin main
   ```

2. **Vercel에서 GitHub 연동**
   - Vercel 대시보드 → **Add New Project**
   - GitHub 저장소 선택
   - **Import** 클릭
   - 자동으로 배포 시작

### 3단계: 환경 변수 설정

1. Vercel 대시보드에서 프로젝트 선택
2. **Settings** → **Environment Variables** 클릭
3. 다음 변수 추가:
   ```
   Name: GEMINI_API_KEY
   Value: your_actual_gemini_api_key
   ```
4. **Save** 클릭
5. **Deployments** 탭에서 **Redeploy** 클릭 (환경 변수 적용)

### 4단계: 접속 확인

- 배포 완료 후 제공되는 URL로 접속
- 예: `https://mbti-test.vercel.app`
- 이 URL을 다른 PC나 모바일에서 열면 접속 가능!

---

## 🌐 방법 2: Netlify 배포

### 1단계: Netlify 계정 생성

1. https://www.netlify.com 접속
2. **Sign up** 클릭
3. GitHub 계정으로 로그인

### 2단계: 프로젝트 배포

#### 방법 A: Netlify CLI

```bash
# 1. Netlify CLI 설치
npm install -g netlify-cli

# 2. 로그인
netlify login

# 3. 프로젝트 디렉토리에서
cd "c:\Users\jongmin\.cursor\projects\MBTI"

# 4. 배포
netlify deploy --prod

# 질문에 답변:
# - Create & configure a new site? → Y
# - Team: → 본인 계정 선택
# - Site name: → mbti-test (또는 원하는 이름)
```

#### 방법 B: 드래그 앤 드롭

1. 프로젝트 빌드:
   ```bash
   npm run build
   ```
2. `.next` 폴더를 Netlify 대시보드에 드래그 앤 드롭

### 3단계: 환경 변수 설정

1. Netlify 대시보드 → 프로젝트 선택
2. **Site settings** → **Environment variables**
3. `GEMINI_API_KEY` 추가
4. **Redeploy** 클릭

---

## 🚂 방법 3: Railway 배포

### 1단계: Railway 계정 생성

1. https://railway.app 접속
2. GitHub 계정으로 로그인

### 2단계: 프로젝트 배포

1. **New Project** → **Deploy from GitHub repo**
2. GitHub 저장소 선택
3. 자동으로 배포 시작

### 3단계: 환경 변수 설정

1. 프로젝트 → **Variables** 탭
2. `GEMINI_API_KEY` 추가
3. 자동 재배포

---

## 🏠 방법 4: 로컬 네트워크에서 접속 (같은 WiFi)

다른 PC가 같은 네트워크에 있다면, 별도 배포 없이 접속 가능합니다.

### 1단계: 로컬 IP 주소 확인

```powershell
# PowerShell에서 실행
ipconfig

# IPv4 주소 찾기 (예: 192.168.0.100)
```

### 2단계: Next.js 서버를 외부 접속 허용으로 실행

`package.json` 수정:

```json
{
  "scripts": {
    "dev": "next dev -H 0.0.0.0",
    "start": "next start -H 0.0.0.0"
  }
}
```

또는 직접 실행:

```bash
# 개발 서버
next dev -H 0.0.0.0

# 프로덕션 서버
next start -H 0.0.0.0
```

### 3단계: 방화벽 설정

Windows 방화벽에서 포트 3000 허용:

```powershell
# 관리자 권한 PowerShell에서
New-NetFirewallRule -DisplayName "Next.js Dev Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### 4단계: 접속

다른 PC/모바일에서:
- `http://192.168.0.100:3000` (본인의 IP 주소로 변경)

**⚠️ 주의사항:**
- 같은 WiFi 네트워크에 있어야 함
- PC가 꺼지면 접속 불가
- 보안상 프로덕션에는 권장하지 않음

---

## 🔧 배포 전 체크리스트

### 필수 확인 사항

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] `package.json`에 빌드 스크립트가 있는지 확인
- [ ] 프로젝트가 빌드되는지 테스트: `npm run build`
- [ ] 환경 변수를 호스팅 플랫폼에 설정

### 빌드 테스트

```bash
# 프로젝트 디렉토리에서
npm run build

# 오류가 없으면 성공!
```

---

## 📱 커스텀 도메인 연결 (선택사항)

### Vercel에서 도메인 추가

1. Vercel 대시보드 → 프로젝트 → **Settings** → **Domains**
2. 원하는 도메인 입력
3. DNS 설정 안내에 따라 도메인 제공업체에서 설정

### 예시
- `mbti-test.com`
- `my-mbti-test.vercel.app` (기본 제공)

---

## 🐛 문제 해결

### 빌드 오류

```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 환경 변수 오류

- 호스팅 플랫폼에서 환경 변수가 제대로 설정되었는지 확인
- 변수 이름이 정확한지 확인 (`GEMINI_API_KEY`)
- 재배포 필요

### 접속 불가

- URL이 정확한지 확인
- 방화벽 설정 확인
- 호스팅 플랫폼 상태 확인

---

## 💡 추천 배포 순서

1. **개발/테스트**: 로컬 네트워크 접속 (방법 4)
2. **프로덕션**: Vercel 배포 (방법 1) ⭐

---

## 📞 추가 도움

- Vercel 문서: https://vercel.com/docs
- Next.js 배포: https://nextjs.org/docs/deployment
- Netlify 문서: https://docs.netlify.com

**준비 완료! 이제 전 세계 어디서나 접속 가능합니다! 🌍**
