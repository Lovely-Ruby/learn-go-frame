# Stage 1: Builder
FROM golang:1.23-alpine AS builder

WORKDIR /app/main

# Copy go.mod and go.sum
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest
COPY . .

# Build
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main .

# Stage 2: Production
FROM alpine:3.18

LABEL maintainer="john@goframe.org"

ENV WORKDIR /app/main

RUN mkdir -p $WORKDIR

# Copy binary
COPY --from=builder /app/main/main $WORKDIR/main
RUN chmod +x $WORKDIR/main

# Copy resources
COPY resource /app/main/resource

# Copy config
COPY manifest/config/config.yaml $WORKDIR/manifest/config/

WORKDIR $WORKDIR

EXPOSE 8000

CMD ["./main"]
