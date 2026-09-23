1..5 | ForEach-Object {
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] --- Request ke-$_ dimulai ---" -ForegroundColor Cyan
    
    try {
        $res = Invoke-WebRequest -Uri "http://172.128.8.43" -UseBasicParsing
        [PSCustomObject]@{
            Waktu        = $timestamp
            Request      = $_
            Status       = $res.StatusCode
            # Sesuaikan nama header di bawah ini jika VM backend kamu ngirim identitas nama VM/IP-nya
            Server       = $res.Headers['Server'] 
            CustomHeader = $res.Headers['X-Backend-Server']
            Content      = $res.Content.Trim() # Ambil isi teks/html pendek kalau ada penanda VM-nya
        }
    } catch {
        Write-Host "[$timestamp] Gagal request ke-$_ : $_" -ForegroundColor Red
    }

    # Kalau ini bukan iterasi terakhir, tunggu 5 menit (300 detik) sebelum lanjut
    if ($_ -lt 5) {
        Write-Host "Menunggu 5 menit sebelum request berikutnya..." -ForegroundColor Yellow
        Start-Sleep -Seconds 300
    }
}