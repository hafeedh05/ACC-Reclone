FROM rust:1.86-slim AS builder

WORKDIR /app

COPY services ./services

RUN cargo build --manifest-path services/Cargo.toml -p orchestrator --release

FROM debian:bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV PORT=8080

COPY --from=builder /app/services/target/release/orchestrator /usr/local/bin/orchestrator

EXPOSE 8080

CMD ["/usr/local/bin/orchestrator"]
