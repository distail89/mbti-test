# 빠른 배포 스크립트 (Vercel CLI 사용)

Write-Host "🚀 빠른 배포 시작..." -ForegroundColor Cyan

# Vercel CLI 확인 및 설치
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "Vercel CLI 설치 중..." -ForegroundColor Yellow
    npm install -g vercel
}

# 로그인 확인
Write-Host "`n🔐 Vercel 로그인 확인 중..." -ForegroundColor Yellow
vercel whoami
if ($LASTEXITCODE -ne 0) {
    Write-Host "로그인이 필요합니다. 브라우저가 열립니다..." -ForegroundColor Yellow
    vercel login
}

# 배포 실행
Write-Host "`n📤 배포 시작..." -ForegroundColor Yellow
vercel --prod

Write-Host "`n✅ 배포 완료!" -ForegroundColor Green
Write-Host "`n⚠️  환경 변수(GEMINI_API_KEY)를 Vercel 대시보드에서 설정해주세요!" -ForegroundColor Yellow
