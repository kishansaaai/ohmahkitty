# TNR Tracker - Hackathon Repository Setup Script
# This script creates a new repository with 100 realistic commits and enhanced security

param(
    [string]$NewRepoPath = "C:\Users\saiki\OneDrive\Documents\Desktop\tnr-tracker-hackathon",
    [string]$AuthorName = "Your Name",
    [string]$AuthorEmail = "your.email@example.com"
)

Write-Host "🐈 TNR Tracker - Hackathon Repository Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

# Create new repository directory
Write-Host "📁 Creating new repository at: $NewRepoPath" -ForegroundColor Yellow
if (Test-Path $NewRepoPath) {
    Write-Host "⚠️  Directory already exists. Please choose a different path or delete the existing directory." -ForegroundColor Red
    exit 1
}

New-Item -ItemType Directory -Path $NewRepoPath -Force | Out-Null
Set-Location $NewRepoPath

# Initialize git repository
Write-Host "🔧 Initializing Git repository..." -ForegroundColor Yellow
git init
git config user.name $AuthorName
git config user.email $AuthorEmail

Write-Host "✅ Repository initialized successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Run the commit generation script: node generate-commits.js" -ForegroundColor White
Write-Host "2. The script will copy files and create 100 realistic commits" -ForegroundColor White
Write-Host "3. Review the SECURITY.md file for security enhancements" -ForegroundColor White
Write-Host ""
Write-Host "📝 Repository created at: $NewRepoPath" -ForegroundColor Green
