# THIS IS FOR WINDOWS (POWERSHELL)
# dev-start.ps1
if (!(Test-Path .\.env)) {
  Write-Host ".env not found. Copy .env.example to .env and edit." -ForegroundColor Yellow
  exit 1
}

# Load .env into session
Get-Content .\.env | ForEach-Object {
  if ($_ -and -not $_.StartsWith('#')) {
    $kv = $_ -split('=',2)
    $name = $kv[0].Trim()
    $value = $kv[1].Trim()
    $env:$name = $value
  }
}

# ensure db exists
New-Item -ItemType Directory -Force backend\data | Out-Null
New-Item -ItemType File -Force backend\data\dev.db | Out-Null

# Start backend
Start-Process -NoNewWindow -FilePath "gradlew.bat" -ArgumentList "bootRun" -WorkingDirectory "backend"

# Prepare frontend .env.local from example and/or copy REACT_APP_ vars from root .env
Copy-Item frontend\.env.example frontend\.env.local -Force
Get-ChildItem env: | Where-Object { $_.Name -like "REACT_APP_*" } | ForEach-Object {
  Add-Content frontend\.env.local "$($_.Name)=$($_.Value)"
}

# Start frontend
Push-Location frontend
npm start
Pop-Location
