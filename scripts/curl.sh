#!/bin/bash
set -e

for i in {1..5}; do
    # Ambil timestamp saat ini
    TIMESTAMP=$(date +"%H:%M:%S")
    echo -e "\033[36m[$TIMESTAMP] --- Request ke-$i dimulai ---\033[0m"

    # Jalankan curl dan simpan hasilnya (HTTP status code dan content)
    # -s: silent, -w: format output untuk ambil status code, -o: simpan body HTML ke file sementara
    RESPONSE_FILE=$(mktemp)
    HTTP_CODE=$(curl -s -w "%{http_code}" -o "$RESPONSE_FILE" http://172.128.8.43)
    
    # Ambil isi file response (content)
    CONTENT=$(cat "$RESPONSE_FILE" | tr -d '\r' | xargs)
    rm -f "$RESPONSE_FILE"

    # Tampilkan hasilnya dalam bentuk ringkas (mirip PSCustomObject)
    echo "Waktu        : $TIMESTAMP"
    echo "Request      : $i"
    echo "Status       : $HTTP_CODE"
    echo "Content      : $CONTENT"
    echo "----------------------------------------"

    # Kalau ini bukan iterasi terakhir, tunggu 5 menit (300 detik)
    if [ $i -lt 5 ]; then
        echo -e "\033[33mMenunggu 5 menit sebelum request berikutnya...\033[0m"
        sleep 300
    fi
done