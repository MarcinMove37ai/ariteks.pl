param(
    [string]$SourceDir = "D:\Pobrane",
    [string]$ProjectDir = "D:\Ariteks\ariteks_www"
)

$ErrorActionPreference = "Stop"

$DestinationDir = Join-Path $ProjectDir "public\images\applications"

$Images = @(
    @{
        SourceBaseName = "ChatGPT Image Jul 13, 2026, 02_17_01 AM (1)"
        DestinationName = "transport.png"
    },
    @{
        SourceBaseName = "ChatGPT Image Jul 13, 2026, 02_17_02 AM (2)"
        DestinationName = "workwear-industrial.png"
    },
    @{
        SourceBaseName = "ChatGPT Image Jul 13, 2026, 02_17_02 AM (3)"
        DestinationName = "outdoor-functional.png"
    },
    @{
        SourceBaseName = "ChatGPT Image Jul 13, 2026, 02_17_02 AM (4)"
        DestinationName = "upholstery-interiors.png"
    },
    @{
        SourceBaseName = "ChatGPT Image Jul 13, 2026, 02_17_03 AM (5)"
        DestinationName = "print-signage.png"
    }
)

if (-not (Test-Path -LiteralPath $SourceDir -PathType Container)) {
    throw "Nie istnieje katalog źródłowy: $SourceDir"
}

if (-not (Test-Path -LiteralPath $DestinationDir -PathType Container)) {
    throw "Nie istnieje katalog docelowy: $DestinationDir"
}

$Resolved = @()
$Missing = @()

foreach ($Image in $Images) {
    $File = Get-ChildItem -LiteralPath $SourceDir -File |
        Where-Object {
            $_.BaseName -eq $Image.SourceBaseName -and
            $_.Extension.ToLowerInvariant() -eq ".png"
        } |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if (-not $File) {
        $Missing += $Image.SourceBaseName
        continue
    }

    $Resolved += @{
        Source = $File.FullName
        Destination = Join-Path $DestinationDir $Image.DestinationName
    }
}

if ($Missing.Count -gt 0) {
    Write-Host ""
    Write-Host "Brakujące pliki:" -ForegroundColor Red
    $Missing | ForEach-Object {
        Write-Host "  - $_" -ForegroundColor Red
    }

    throw "Przerwano: nie znaleziono wszystkich nowych grafik."
}

$BackupDir = Join-Path `
    -Path $DestinationDir `
    -ChildPath "_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"

New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null

foreach ($Item in $Resolved) {
    if (Test-Path -LiteralPath $Item.Destination) {
        Copy-Item `
            -LiteralPath $Item.Destination `
            -Destination (Join-Path $BackupDir (Split-Path $Item.Destination -Leaf)) `
            -Force
    }
}

Write-Host ""
Write-Host "Kopia poprzednich grafik: $BackupDir" -ForegroundColor DarkYellow
Write-Host "Podmienianie grafik..." -ForegroundColor Cyan

foreach ($Item in $Resolved) {
    Copy-Item `
        -LiteralPath $Item.Source `
        -Destination $Item.Destination `
        -Force

    Write-Host (
        "[PODMIENIONO] {0} -> {1}" -f
        (Split-Path $Item.Source -Leaf),
        (Split-Path $Item.Destination -Leaf)
    ) -ForegroundColor Green
}

Write-Host ""
Write-Host "Gotowe. Pozostałych grafik i plików nie zmieniono." -ForegroundColor Green
Write-Host ""
Write-Host "Aktualne pliki:" -ForegroundColor Cyan

Get-ChildItem -LiteralPath $DestinationDir -File |
    Where-Object {
        $_.Name -in @(
            "transport.png",
            "workwear-industrial.png",
            "outdoor-functional.png",
            "upholstery-interiors.png",
            "print-signage.png"
        )
    } |
    Select-Object Name, Length, LastWriteTime |
    Sort-Object Name |
    Format-Table -AutoSize