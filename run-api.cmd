@echo off
setlocal EnableDelayedExpansion
set ROOT=%~dp0
set KEY_FILE=C:\Users\abdul\Desktop\hyvelabs\.aether.api.key.txt
if exist "%KEY_FILE%" (
  for /f "usebackq tokens=1* delims==" %%A in ("%KEY_FILE%") do (
    if not "%%A"=="" (
      set "key=%%A"
      set "val=%%B"
      if "!key:~0,1!"=="#" set "key="
      if not "!key!"=="" (
        set "val=!val:\"=!"
        set "!key!=!val!"
      )
    )
  )
) else if exist "%USERPROFILE%\\.aether-keys.cmd" (
  call "%USERPROFILE%\\.aether-keys.cmd"
)
if "%OPENAI_SCRIPT_MODEL%"=="" set OPENAI_SCRIPT_MODEL=gpt-5.4
if "%GEMINI_SCRIPT_MODEL%"=="" set GEMINI_SCRIPT_MODEL=gemini-2.0-flash
if "%GEMINI_VIDEO_MODEL%"=="" set GEMINI_VIDEO_MODEL=veo-3.1-generate-preview
if "%GEMINI_API_KEY%"=="" (
  echo Missing GEMINI_API_KEY. Update %KEY_FILE%
  pause
  exit /b 1
)
set AETHER_MEDIA_DIR=%ROOT%media
set AETHER_MEDIA_BASE_URL=http://localhost:8080/media
if not exist "%AETHER_MEDIA_DIR%" mkdir "%AETHER_MEDIA_DIR%"
set CARGO_EXE=%USERPROFILE%\.cargo\bin\cargo.exe
set CARGO_TARGET_DIR=%USERPROFILE%\.cargo\target\acc-reclone-master
if not exist "%CARGO_EXE%" echo Missing cargo. Install Rust via rustup or winget & exit /b 1
if not exist "%CARGO_TARGET_DIR%" mkdir "%CARGO_TARGET_DIR%"
for /f "tokens=5" %%P in ('netstat -aon ^| find ":8080" ^| find "LISTENING"') do set "AETHER_PID=%%P"
if defined AETHER_PID (
  echo Port 8080 in use by PID %AETHER_PID%. Stopping it...
  taskkill /PID %AETHER_PID% /F >nul 2>&1
)
echo Starting API on http://localhost:8080 ...
"%CARGO_EXE%" run --manifest-path "%ROOT%services\\Cargo.toml" -p api
if errorlevel 1 (
  echo API exited with an error. See the messages above.
  pause
)
endlocal
