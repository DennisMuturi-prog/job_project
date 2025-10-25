Set-Location -Path "public"

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Cyan
Write-Host "Looking for images..." -ForegroundColor Cyan

$images = Get-ChildItem -Path . -Filter *.png -File
$images += Get-ChildItem -Path . -Filter *.jpeg -File
$images += Get-ChildItem -Path . -Filter *.jpg -File

Write-Host "Found $($images.Count) images" -ForegroundColor Yellow

if ($images.Count -eq 0) {
    Write-Host "No PNG, JPEG, or JPG files found in the public folder!" -ForegroundColor Red
    Get-ChildItem -Path . | Format-Table Name
} else {
    foreach ($file in $images) {
        $outputName = $file.BaseName + ".webp"
        Write-Host "`nOptimizing $($file.Name)..." -ForegroundColor Yellow
        
        # Correct sharp-cli syntax
        npx sharp-cli resize 200 200 -i $file.Name -o $outputName
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Successfully optimized $($file.Name)" -ForegroundColor Green
        } else {
            Write-Host "Failed to optimize $($file.Name)" -ForegroundColor Red
        }
    }
    
    Write-Host "`nShowing all files in public folder:" -ForegroundColor Cyan
    Get-ChildItem -Path . | Format-Table Name
}

Write-Host "`nDone!" -ForegroundColor Cyan
Read-Host -Prompt "Press Enter to exit"