@echo off
ECHO =====================================
ECHO TNR Tracker - Hackathon Repo Creator
ECHO =====================================
ECHO.
ECHO This script will create a new repository
ECHO with 113 realistic commits for your hackathon!
ECHO.

SET /P REPO_NAME="Enter new repository folder name (default: tnr-tracker-hackathon): "
IF "%REPO_NAME%"=="" SET REPO_NAME=tnr-tracker-hackathon

SET /P AUTHOR_NAME="Enter your name (for git commits): "
SET /P AUTHOR_EMAIL="Enter your email (for git commits): "

SET TARGET_DIR=%USERPROFILE%\OneDrive\Documents\Desktop\%REPO_NAME%

ECHO.
ECHO Configuration:
ECHO   Repository: %TARGET_DIR%
ECHO   Author: %AUTHOR_NAME% ^<%AUTHOR_EMAIL%^>
ECHO.
ECHO Press any key to continue or Ctrl+C to cancel...
PAUSE >nul

ECHO.
ECHO [1/2] Running commit generator...
node generate-commits.js "%TARGET_DIR%" "%AUTHOR_NAME%" "%AUTHOR_EMAIL%"

IF ERRORLEVEL 1 (
    ECHO.
    ECHO ERROR: Commit generation failed!
    PAUSE
    EXIT /B 1
)

ECHO.
ECHO [2/2] Repository created successfully!
ECHO.
ECHO =====================================
ECHO NEXT STEPS:
ECHO =====================================
ECHO.
ECHO 1. Navigate to repository:
ECHO    cd %TARGET_DIR%
ECHO.
ECHO 2. Install dependencies:
ECHO    npm install
ECHO.
ECHO 3. Create .env file with your API keys:
ECHO    copy .env.example .env
ECHO.
ECHO 4. Create GitHub repository and push:
ECHO    git remote add origin https://github.com/yourusername/tnr-tracker.git
ECHO    git branch -M main
ECHO    git push -u origin main
ECHO.
ECHO 5. Deploy to Vercel:
ECHO    - Visit vercel.com
ECHO    - Import Git repository
ECHO    - Add environment variables
ECHO    - Deploy!
ECHO.
ECHO =====================================
ECHO SECURITY CHECKLIST:
ECHO =====================================
ECHO [ ] Review SECURITY.md
ECHO [ ] Update .env with production API keys
ECHO [ ] Enable Supabase RLS policies
ECHO [ ] Configure CORS in Edge Functions
ECHO [ ] Set up monitoring (Sentry)
ECHO.
ECHO Repository ready at: %TARGET_DIR%
ECHO.
PAUSE
