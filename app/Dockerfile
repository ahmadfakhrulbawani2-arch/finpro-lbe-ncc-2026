FROM nginx:alpine

# aku mau workspace disimpan di /app karena defaultnya di root server /usr/share/nginx/html
WORKDIR /app

# copy semua isi app/ yaitu di cwd kecuali yang terlist di .dockerignore
COPY . .

# hapus default config nginx dari base image
RUN rm -f /etc/nginx/conf.d/default.conf

# ganti dengan nginx.conf kita sendiri
RUN mv /app/nginx.conf /etc/nginx/nginx.conf

# kasih permission execute
RUN chmod +x /app/entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/app/entrypoint.sh"]