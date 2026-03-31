@echo off
setlocal
set ROOT=%~dp0
pushd "%ROOT%"
start "" cmd /k "%ROOT%run-api.cmd"
start "" cmd /k "set NEXT_PUBLIC_API_URL=http://127.0.0.1:8080 && set AD_COMMAND_CENTER_API_URL=http://127.0.0.1:8080 && set PORT=3002 && npx -y pnpm@9.12.2 --dir apps/web dev"
ping 127.0.0.1 -n 6 >nul
start "" http://localhost:3002/sign-in
popd
endlocal
