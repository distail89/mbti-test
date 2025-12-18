# 📤 GitHub에 코드 업로드 가이드

## 🚀 빠른 가이드 (3단계)

### 1단계: GitHub 저장소 생성

1. **GitHub 접속**
   - https://github.com 접속
   - 로그인 (계정이 없으면 회원가입)

2. **새 저장소 생성**
   - 우측 상단 **+** 버튼 클릭
   - **New repository** 선택
   - 저장소 이름 입력: `mbti-test` (또는 원하는 이름)
   - 설명 입력 (선택): "32가지 MBTI 성격유형 검사"
   - **Public** 또는 **Private** 선택
   - ⚠️ **"Initialize this repository with a README" 체크 해제** (이미 코드가 있으므로)
   - **Create repository** 클릭

3. **저장소 URL 복사**
   - 생성된 페이지에서 URL 복사
   - 예: `https://github.com/your-username/mbti-test.git`

---

### 2단계: 로컬에서 GitHub 연결

PowerShell 또는 터미널에서 실행:

```powershell
# 프로젝트 디렉토리로 이동
cd "c:\Users\jongmin\.cursor\projects\MBTI"

# 변경사항 확인 및 커밋 (필요시)
git add .
git commit -m "Update: 배포 준비 완료"

# GitHub 저장소 연결 (위에서 복사한 URL 사용)
git remote add origin https://github.com/your-username/mbti-test.git

# 브랜치 이름을 main으로 변경
git branch -M main

# 코드 업로드
git push -u origin main
```

**⚠️ 주의사항:**
- `your-username`을 본인의 GitHub 사용자명으로 변경하세요
- `mbti-test`를 위에서 만든 저장소 이름으로 변경하세요

---

### 3단계: 업로드 확인

1. GitHub 저장소 페이지 새로고침
2. 파일들이 업로드되었는지 확인
3. ✅ 완료!

---

## 🔐 인증 방법

### 방법 1: Personal Access Token (권장)

1. **토큰 생성**
   - GitHub → 우측 상단 프로필 → **Settings**
   - 왼쪽 메뉴 → **Developer settings**
   - **Personal access tokens** → **Tokens (classic)**
   - **Generate new token (classic)** 클릭
   - Note: `MBTI Project` 입력
   - Expiration: 원하는 기간 선택
   - Scopes: `repo` 체크
   - **Generate token** 클릭
   - ⚠️ **토큰을 즉시 복사하세요!** (다시 볼 수 없습니다)

2. **토큰으로 푸시**
   ```powershell
   # 푸시 시 사용자명과 토큰 입력 요청됨
   git push -u origin main
   
   # Username: 본인의 GitHub 사용자명
   # Password: 위에서 생성한 Personal Access Token
   ```

### 방법 2: GitHub Desktop 사용

1. **GitHub Desktop 설치**
   - https://desktop.github.com 접속
   - 다운로드 및 설치

2. **저장소 추가**
   - File → Add Local Repository
   - `c:\Users\jongmin\.cursor\projects\MBTI` 선택
   - GitHub에 연결

3. **업로드**
   - 변경사항 커밋
   - Publish repository 클릭

### 방법 3: SSH 키 사용 (고급)

1. **SSH 키 생성**
   ```powershell
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **공개키 복사**
   ```powershell
   cat ~/.ssh/id_ed25519.pub
   ```

3. **GitHub에 추가**
   - GitHub → Settings → SSH and GPG keys
   - New SSH key 클릭
   - 복사한 키 붙여넣기

4. **SSH URL로 변경**
   ```powershell
   git remote set-url origin git@github.com:your-username/mbti-test.git
   git push -u origin main
   ```

---

## 🐛 문제 해결

### 오류: "remote origin already exists"

```powershell
# 기존 원격 저장소 제거
git remote remove origin

# 다시 추가
git remote add origin https://github.com/your-username/mbti-test.git
```

### 오류: "Authentication failed"

- Personal Access Token을 사용하세요
- 토큰이 만료되지 않았는지 확인
- `repo` 권한이 있는지 확인

### 오류: "Permission denied"

- 저장소가 본인 계정에 있는지 확인
- 저장소 이름과 사용자명이 정확한지 확인

### 오류: "Failed to push some refs"

```powershell
# 원격 저장소의 변경사항 가져오기
git pull origin main --allow-unrelated-histories

# 충돌 해결 후 다시 푸시
git push -u origin main
```

---

## ✅ 업로드 후 다음 단계

### Vercel 자동 배포 설정

1. **Vercel 접속**
   - https://vercel.com 접속
   - 로그인

2. **프로젝트 추가**
   - **Add New Project** 클릭
   - GitHub 저장소 선택
   - **Import** 클릭

3. **환경 변수 설정**
   - Settings → Environment Variables
   - `GEMINI_API_KEY` 추가
   - **Save** 클릭

4. **자동 배포 완료!**
   - 이제 GitHub에 푸시할 때마다 자동 배포됩니다!

---

## 📝 요약 명령어

```powershell
# 1. 프로젝트 디렉토리로 이동
cd "c:\Users\jongmin\.cursor\projects\MBTI"

# 2. 변경사항 커밋 (필요시)
git add .
git commit -m "배포 준비 완료"

# 3. GitHub 저장소 연결
git remote add origin https://github.com/your-username/mbti-test.git

# 4. 브랜치 이름 변경
git branch -M main

# 5. 코드 업로드
git push -u origin main
```

**준비 완료! 🚀**
