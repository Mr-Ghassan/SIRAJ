# SIRAJ v1.0 — rebuild the release ZIPs from the parts and verify them against the published SHA-256 sums (Windows PowerShell).
# Usage: powershell -ExecutionPolicy Bypass -File join.ps1 [-Out out]
param([string]$Out = "out")
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
New-Item -ItemType Directory -Force -Path $Out | Out-Null
$names = Get-ChildItem parts -Filter *.part00 | ForEach-Object { $_.Name -replace '\.part00$','' }
foreach ($n in $names) {
  $dest = [IO.File]::Create((Join-Path (Resolve-Path $Out) $n))
  Get-ChildItem parts -Filter "$n.part*" | Sort-Object Name | ForEach-Object { $b = [IO.File]::ReadAllBytes($_.FullName); $dest.Write($b, 0, $b.Length) }
  $dest.Close()
}
Copy-Item whole\*.zip $Out
$bad = 0
foreach ($line in Get-Content SIRAJ_v1.0_SHA256SUMS.txt) {
  $hash, $file = $line -split '\s+', 2
  $actual = (Get-FileHash (Join-Path $Out $file) -Algorithm SHA256).Hash.ToLower()
  if ($actual -eq $hash) { "${file}: OK" } else { "${file}: FAILED"; $bad++ }
}
if ($bad) { throw "$bad package(s) failed verification" } else { "All 10 SIRAJ v1.0 packages rebuilt and verified in: $(Resolve-Path $Out)" }
