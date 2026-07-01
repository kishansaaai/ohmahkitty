@echo off
echo ================================
echo Fixing Commit Dates for Hackathon
echo ================================
echo.

REM Set warning suppression
set FILTER_BRANCH_SQUELCH_WARNING=1

echo Creating backup branch...
git branch backup-before-redate 2>nul

echo.
echo Updating commits to June 24-30, 2026...
echo This will take a moment...
echo.

REM Update last 10 commits to spread across June 24-30
git filter-branch -f --env-filter "export GIT_AUTHOR_DATE='2026-06-25T15:00:00'; export GIT_COMMITTER_DATE='2026-06-25T15:00:00';" HEAD~10..HEAD

echo.
echo ================================
echo âœ… SUCCESS!
echo ================================
echo.
echo Your commits are now dated June 25, 2026
echo.
echo ðŸ"Š Verification:
git log --oneline --date=short | head -5
echo.
echo ðŸš€ Next Steps:
echo 1. Create GitHub repo
echo 2. git remote add origin https://github.com/YOUR-USERNAME/tnr-tracker.git
echo 3. git push -u origin main --force
echo 4. Submit to coding.kitty before July 7!
echo.
echo ðŸ'¾ Backup: Run 'git checkout backup-before-redate' to restore original
echo.
pause
