# 🚀 자동 배포 가이드

배포를 최대한 자동화했습니다! 다음 단계만 따라주세요.

## ⚡ 빠른 배포 (3단계)

### 1단계: Vercel CLI 설치 및 로그인

```powershell
# PowerShell에서 실행
npm install -g vercel
vercel login
```

브라우저가 열리면 Vercel 계정으로 로그인하세요.

### 2단계: 자동 배포 실행

```powershell
# 프로젝트 디렉토리에서
cd "c:\Users\jongmin\.cursor\projects\MBTI"

# 배포 스크립트 실행
.\scripts\quick-deploy.ps1

# 또는 직접 실행
npm run deploy
```

### 3단계: 환경 변수 설정

1. 배포 완료 후 제공되는 URL 클릭 (또는 Vercel 대시보드 접속)
2. 프로젝트 선택 → **Settings** → **Environment Variables**
3. 다음 추가:
   ```
   Name: GEMINI_API_KEY
   Value: (본인의 Gemini API 키)
   ```
4. **Save** → **Deployments** 탭 → **Redeploy** 클릭

**완료! 🎉**

---

## 📦 상세 배포 스크립트

더 자세한 안내가 필요하면:

```powershell
.\scripts\deploy.ps1
```

이 스크립트는:
- ✅ Git 저장소 자동 초기화
- ✅ 빌드 테스트
- ✅ Vercel CLI 설치 확인
- ✅ GitHub 연동 옵션 제공

---

## 🔄 GitHub 연동 (자동 배포)

코드를 GitHub에 올리면 자동으로 배포됩니다!

### 1. GitHub 저장소 생성

1. https://github.com 접속
2. **New repository** 클릭
3. 저장소 이름: `mbti-test` (또는 원하는 이름)
4. **Create repository** 클릭

### 2. 코드 업로드

```powershell
# 이미 Git 초기화 완료됨
git remote add origin https://github.com/your-username/mbti-test.git
git branch -M main
git push -u origin main
```

### 3. Vercel에서 GitHub 연동

1. https://vercel.com 접속
2. **Add New Project** 클릭
3. GitHub 저장소 선택
4. **Import** 클릭
5. 환경 변수 설정 (GEMINI_API_KEY)
6. **Deploy** 클릭

**이제 코드를 푸시할 때마다 자동 배포됩니다!** 🚀

---

## 🎯 배포 방법 비교

| 방법 | 속도 | 자동화 | 추천 |
|------|------|--------|------|
| **빠른 배포** (`npm run deploy`) | ⚡ 빠름 | ⭐⭐ | 테스트용 |
| **GitHub 연동** | ⚡ 빠름 | ⭐⭐⭐⭐⭐ | 프로덕션 |

---

## ✅ 배포 전 체크리스트

- [x] Git 저장소 초기화 완료
- [x] `.gitignore` 설정 완료
- [x] 빌드 스크립트 준비 완료
- [ ] Vercel 계정 생성
- [ ] Vercel 로그인
- [ ] 환경 변수 설정

---

## 🐛 문제 해결

### PowerShell 실행 정책 오류

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Vercel 로그인 실패

브라우저에서 직접 로그인:
1. https://vercel.com/login 접속
2. 로그인 후 다시 `vercel login` 실행

### 빌드 오류

```powershell
npm install
npm run build
```

오류 메시지를 확인하세요.

---

## 📞 도움말

- Vercel 문서: https://vercel.com/docs
- 배포 가이드: `DEPLOYMENT.md` 참고

**준비 완료! 이제 배포만 하면 됩니다! 🎉**
