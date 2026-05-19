$srcDir = "C:\Users\gowda\.gemini\antigravity\brain\44be73b0-424e-4c62-a277-1b3055bf1ca3"
$destDir = "c:\Users\gowda\OneDrive\Desktop\DELTA_V1\docs\screenshots"

# Create destination directory
New-Item -ItemType Directory -Path $destDir -Force

# Copy screenshots
Copy-Item "$srcDir\login_page_1779203301871.png" "$destDir\login_page.png" -Force
Copy-Item "$srcDir\chat_light_mode_1779203330685.png" "$destDir\chat_light_mode.png" -Force
Copy-Item "$srcDir\chat_dark_mode_1779203347482.png" "$destDir\chat_dark_mode.png" -Force
Copy-Item "$srcDir\group_chat_modal_1779203375921.png" "$destDir\group_chat_modal.png" -Force
Copy-Item "$srcDir\user_search_1779203416558.png" "$destDir\user_search.png" -Force

# Copy diagrams to docs folder
$docsDir = "c:\Users\gowda\OneDrive\Desktop\DELTA_V1\docs"
Copy-Item "$srcDir\architecture_diagram_1779203479716.png" "$docsDir\architecture_diagram.png" -Force
Copy-Item "$srcDir\delta_cover_banner_1779203506059.png" "$docsDir\delta_cover_banner.png" -Force

Write-Host "All files copied successfully!"
Get-ChildItem $destDir
Get-ChildItem $docsDir -File
