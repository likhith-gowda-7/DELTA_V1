$srcDir = "C:\Users\gowda\.gemini\antigravity\brain\44be73b0-424e-4c62-a277-1b3055bf1ca3"
$destDir = "c:\Users\gowda\OneDrive\Desktop\DELTA_V1\screenshots"

# Create destination directory
New-Item -ItemType Directory -Path $destDir -Force

# Copy screenshots
Copy-Item "$srcDir\login_page_1779203301871.png" "$destDir\login_page.png" -Force
Copy-Item "$srcDir\chat_light_mode_1779203330685.png" "$destDir\chat_light_mode.png" -Force
Copy-Item "$srcDir\chat_dark_mode_1779203347482.png" "$destDir\chat_dark_mode.png" -Force
Copy-Item "$srcDir\group_chat_modal_1779203375921.png" "$destDir\group_chat_modal.png" -Force
Copy-Item "$srcDir\user_search_1779203416558.png" "$destDir\user_search.png" -Force
Copy-Item "$srcDir\architecture_diagram_1779203479716.png" "$destDir\architecture_diagram.png" -Force
Copy-Item "$srcDir\delta_cover_banner_1779203506059.png" "$destDir\delta_cover_banner.png" -Force

# Remove old docs folder if it exists
$docsDir = "c:\Users\gowda\OneDrive\Desktop\DELTA_V1\docs"
if (Test-Path $docsDir) { Remove-Item $docsDir -Recurse -Force }

# Remove this script itself
Remove-Item "c:\Users\gowda\OneDrive\Desktop\DELTA_V1\copy_assets.ps1" -Force

Write-Host ""
Write-Host "All 7 images copied to screenshots/ folder:" -ForegroundColor Green
Get-ChildItem $destDir | Format-Table Name, Length -AutoSize
