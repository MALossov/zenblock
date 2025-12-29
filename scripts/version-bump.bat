@echo off
REM Version Bump Script for ZenBlock (Windows)
REM Usage: version-bump.bat [major|minor|patch]

setlocal enabledelayedexpansion

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    exit /b 1
)

REM Get current version from package.json
for /f "tokens=*" %%i in ('node -p "require('./package.json').version"') do set CURRENT_VERSION=%%i

echo Current version: %CURRENT_VERSION%

REM Parse version
for /f "tokens=1,2,3 delims=." %%a in ("%CURRENT_VERSION%") do (
    set major=%%a
    set minor=%%b
    set patch=%%c
)

REM Determine new version
if "%1"=="major" (
    set /a major+=1
    set minor=0
    set patch=0
) else if "%1"=="minor" (
    set /a minor+=1
    set patch=0
) else if "%1"=="patch" (
    set /a patch+=1
) else (
    echo [ERROR] Usage: %0 [major^|minor^|patch]
    echo   major: 1.0.0 -^> 2.0.0
    echo   minor: 1.0.0 -^> 1.1.0
    echo   patch: 1.0.0 -^> 1.0.1
    exit /b 1
)

set NEW_VERSION=%major%.%minor%.%patch%

echo New version: %NEW_VERSION%

REM Update package.json
echo Updating package.json...
powershell -Command "$content = Get-Content -Path 'package.json' -Raw -Encoding UTF8; $content = $content -replace '\"version\": \"%CURRENT_VERSION%\"', '\"version\": \"%NEW_VERSION%\"'; [System.IO.File]::WriteAllText((Resolve-Path 'package.json').Path, $content, [System.Text.UTF8Encoding]::new($false))"

REM Update README badges (skip for now - will be updated by GitHub Actions)
echo Skipping README badge updates (GitHub Actions will handle this)

REM Git operations
echo Committing changes...
git add package.json
git commit -m "chore: bump version to %NEW_VERSION%"

echo.
echo [SUCCESS] Version bumped to %NEW_VERSION%
echo.
echo Next steps:
echo   1. Review the changes: git show
echo   2. Push to GitHub: git push origin master
echo   3. The GitHub Action will automatically:
echo      - Create tag v%NEW_VERSION%
echo      - Build and push Docker images
echo      - Create a GitHub Release
echo.
echo Or manually create tag:
echo   git tag v%NEW_VERSION%
echo   git push origin v%NEW_VERSION%
echo.

endlocal
