@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM Colors
set "GREEN=[32m"
set "YELLOW=[33m"
set "RED=[31m"
set "CYAN=[36m"
set "RESET=[0m"

set "APP_DIR=%~dp0"
set "PID_FILE=%APP_DIR%.zenblock.pid"

if "%1"=="" goto help

if "%1"=="install" goto install
if "%1"=="uninstall" goto uninstall
if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="restart" goto restart
if "%1"=="status" goto status
if "%1"=="open" goto open
if "%1"=="dashboard" goto dashboard
if "%1"=="logs" goto logs
goto help

:install
echo %CYAN%Installing ZenBlock service...%RESET%
echo.

REM Create VBS script to create shortcut
set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "VBS_FILE=%TEMP%\create-zenblock-shortcut.vbs"

echo Set oWS = WScript.CreateObject("WScript.Shell") > "%VBS_FILE%"
echo sLinkFile = "%STARTUP_DIR%\ZenBlock.lnk" >> "%VBS_FILE%"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%VBS_FILE%"
echo oLink.TargetPath = "cmd.exe" >> "%VBS_FILE%"
echo oLink.Arguments = "/c cd /d ""%APP_DIR%"" && start.bat" >> "%VBS_FILE%"
echo oLink.WorkingDirectory = "%APP_DIR%" >> "%VBS_FILE%"
echo oLink.WindowStyle = 7 >> "%VBS_FILE%"
echo oLink.Save >> "%VBS_FILE%"

cscript //nologo "%VBS_FILE%"
del "%VBS_FILE%"

echo %GREEN%Auto-start enabled successfully!%RESET%
echo Shortcut created in Startup folder
goto end

:uninstall
echo %CYAN%Uninstalling ZenBlock service...%RESET%
echo.

set "STARTUP_FILE=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\ZenBlock.lnk"
if exist "%STARTUP_FILE%" (
    del "%STARTUP_FILE%"
    echo %GREEN%Auto-start disabled successfully!%RESET%
) else (
    echo %YELLOW%Auto-start was not enabled%RESET%
)
goto end

:start
echo %CYAN%Starting ZenBlock service...%RESET%
echo.

if exist "%PID_FILE%" (
    echo %YELLOW%Service is already running!%RESET%
    goto end
)

cd /d "%APP_DIR%"
start /b "" cmd /c "npm run start > nul 2>&1"
echo !ERRORLEVEL! > "%PID_FILE%"

echo %GREEN%Service started successfully!%RESET%
echo Access at: http://localhost:3000
goto end

:stop
echo %CYAN%Stopping ZenBlock service...%RESET%
echo.

if not exist "%PID_FILE%" (
    echo %YELLOW%Service is not running!%RESET%
    goto end
)

taskkill /f /im node.exe >nul 2>&1
del "%PID_FILE%"

echo %GREEN%Service stopped successfully!%RESET%
goto end

:restart
echo %CYAN%Restarting ZenBlock service...%RESET%
call :stop
timeout /t 2 /nobreak >nul
call :start
goto end

:status
if exist "%PID_FILE%" (
    echo %GREEN%Service Status: RUNNING%RESET%
) else (
    echo %RED%Service Status: STOPPED%RESET%
)
goto end

:open
echo %CYAN%Opening console in browser...%RESET%
start http://localhost:3000/zh
goto end

:dashboard
echo %CYAN%Opening dashboard in browser...%RESET%
start http://localhost:3000/zh/dashboard
goto end

:logs
echo %CYAN%Recent logs:%RESET%
echo %YELLOW%Log viewing not yet implemented%RESET%
goto end

:help
echo.
echo %CYAN%ZenBlock Service Management CLI%RESET%
echo.
echo Usage: zenblock-cli.bat [command]
echo.
echo Commands:
echo   install     Install service (enable auto-start)
echo   uninstall   Uninstall service (disable auto-start)
echo   start       Start ZenBlock service
echo   stop        Stop ZenBlock service
echo   restart     Restart ZenBlock service
echo   status      Check service status
echo   open        Open console in browser
echo   dashboard   Open dashboard in browser
echo   logs        View service logs
echo.
goto end

:end
endlocal
