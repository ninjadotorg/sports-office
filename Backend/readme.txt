//====================================Node config server ================================================
https://stackoverflow.com/questions/12102110/nginx-to-reverse-proxy-websockets-and-enable-ssl-wss
https://www.tutorialspoint.com/articles/how-to-configure-nginx-as-reverse-proxy-for-websocket

upstream localhost {
    server localhost:8082;
}
upstream api {
    server localhost:8081;
}
 

server {
  listen        80 default_server;
  listen        [::]:80 default_server;
  server_name     localhost;
  access_log	  /var/log/nginx/localhost.access.log combined;
  error_log  /var/log/nginx/nginx_error.log  warn;

  location / {
    proxy_pass     http://localhost/;
  }
  location /api {
    proxy_pass     http://api/api;
  }

  location /game/ws {
    proxy_pass     http://api/game/ws;

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
    # WebSocket support
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

  }

}



