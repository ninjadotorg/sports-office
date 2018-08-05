FROM golang:alpine AS build
EXPOSE 8081
WORKDIR /go/src/github.com/sportbike

ADD . .

# RUN go install github.com/sportbike

# RUN go build -v -o sportbike ./main.go

CMD ["./sportbike"]

#env GOOS=linux GOARCH=amd64 go build github.com/mholt/caddy/caddy

# GOOS=linux GOARCH=amd64 go build -v -o sportbike ./main.go

# docker build -t sportbike:1 .
# 
