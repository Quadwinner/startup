# PowerShell script to start ngrok
Write-Host "Starting ngrok to expose port 3000..." -ForegroundColor Green

# Check if ngrok is in the path
try {
    $ngrokPath = (Get-Command ngrok -ErrorAction Stop).Source
    Write-Host "Found ngrok at: $ngrokPath" -ForegroundColor Green
}
catch {
    Write-Host "Could not find ngrok in PATH. Checking for npm global installation..." -ForegroundColor Yellow
    
    # Check in npm global path
    $npmPath = "$env:APPDATA\npm\ngrok.cmd"
    if (Test-Path $npmPath) {
        $ngrokPath = $npmPath
        Write-Host "Found ngrok at npm location: $ngrokPath" -ForegroundColor Green
    }
    else {
        Write-Host "Ngrok not found. Please make sure ngrok is installed using 'npm install -g ngrok'" -ForegroundColor Red
        Write-Host "Press any key to exit..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit
    }
}

# Start ngrok
Write-Host "Starting ngrok with command: $ngrokPath http 3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop ngrok when finished" -ForegroundColor Yellow
Write-Host "-----------------------------------------------------------" -ForegroundColor Cyan

# Start the process
try {
    & $ngrokPath http 3000
}
catch {
    Write-Host "Error starting ngrok: $_" -ForegroundColor Red
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} 
 