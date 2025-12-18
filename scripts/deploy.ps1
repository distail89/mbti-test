# MBTI 프로젝트 자동 배포 스크립트
# PowerShell 실행 정책이 제한되어 있다면: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

Write-Host "🚀 MBTI 프로젝트 배포 준비 중..." -ForegroundColor Cyan

# 1. Git 초기화 확인
Write-Host "`n📦 Git 저장소 확인 중..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    Write-Host "Git 저장소를 초기화합니다..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit: MBTI test application"
    Write-Host "✅ Git 저장소 초기화 완료" -ForegroundColor Green
} else {
    Write-Host "✅ Git 저장소가 이미 존재합니다" -ForegroundColor Green
}

# 2. 빌드 테스트
Write-Host "`n🔨 프로젝트 빌드 테스트 중..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 빌드 실패! 오류를 확인하세요." -ForegroundColor Red
    exit 1
}
Write-Host "✅ 빌드 성공!" -ForegroundColor Green

# 3. Vercel CLI 확인
Write-Host "`n🔍 Vercel CLI 확인 중..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "Vercel CLI를 설치합니다..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI 설치 완료" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI가 이미 설치되어 있습니다" -ForegroundColor Green
}

# 4. 배포 안내
Write-Host "`n" -NoNewline
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "📋 배포 단계 안내" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "다음 단계를 따라주세요:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Vercel 로그인:" -ForegroundColor White
Write-Host "   vercel login" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  프로젝트 배포:" -ForegroundColor White
Write-Host "   vercel" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  환경 변수 설정:" -ForegroundColor White
Write-Host "   - Vercel 대시보드 접속" -ForegroundColor Gray
Write-Host "   - 프로젝트 → Settings → Environment Variables" -ForegroundColor Gray
Write-Host "   - GEMINI_API_KEY 추가" -ForegroundColor Gray
Write-Host "   - Redeploy 클릭" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 자동 배포를 원하시면 GitHub에 푸시 후 Vercel에서 연동하세요!" -ForegroundColor Cyan
Write-Host ""

# 5. GitHub 연동 옵션
$useGitHub = Read-Host "GitHub에 코드를 업로드하시겠습니까? (y/n)"
if ($useGitHub -eq "y" -or $useGitHub -eq "Y") {
    Write-Host "`n📤 GitHub 업로드 준비 중..." -ForegroundColor Yellow
    
    $repoUrl = Read-Host "GitHub 저장소 URL을 입력하세요 (예: https://github.com/username/mbti-test.git)"
    if ($repoUrl) {
        $hasRemote = git remote -v | Select-String "origin"
        if (-not $hasRemote) {
            git remote add origin $repoUrl
            Write-Host "✅ 원격 저장소 추가 완료" -ForegroundColor Green
        } else {
            Write-Host "⚠️  원격 저장소가 이미 존재합니다" -ForegroundColor Yellow
        }
        
        Write-Host "`n코드를 푸시합니다..." -ForegroundColor Yellow
        git branch -M main
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ GitHub 업로드 완료!" -ForegroundColor Green
            Write-Host ""
            Write-Host "다음 단계:" -ForegroundColor Cyan
            Write-Host "1. https://vercel.com 접속" -ForegroundColor White
            Write-Host "2. Add New Project 클릭" -ForegroundColor White
            Write-Host "3. GitHub 저장소 선택" -ForegroundColor White
            Write-Host "4. Import 클릭 (자동 배포 시작!)" -ForegroundColor White
        }
    }
}

Write-Host "`n✨ 준비 완료!" -ForegroundColor Green
