@echo off
echo You'll need to sign up for a free ngrok account at https://ngrok.com/
echo Then copy your auth token from the ngrok dashboard
echo.
set /p AUTH_TOKEN=Enter your ngrok auth token: 
ngrok authtoken %AUTH_TOKEN%
echo.
echo Now starting ngrok to expose port 3000...
ngrok http 3000
pause 
 