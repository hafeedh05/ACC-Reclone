PNPM := pnpm

.PHONY: install dev-web build-web lint-web rust-check rust-test verify

install:
	$(PNPM) install

dev-web:
	$(PNPM) dev:web

build-web:
	$(PNPM) build:web

lint-web:
	$(PNPM) lint:web

rust-check:
	cargo check --manifest-path services/Cargo.toml --workspace

rust-test:
	cargo test --manifest-path services/Cargo.toml --workspace

run-api:
	cargo run --manifest-path services/Cargo.toml -p api

run-orchestrator:
	cargo run --manifest-path services/Cargo.toml -p orchestrator

run-workers:
	cargo run --manifest-path services/Cargo.toml -p workers -- --help

verify:
	$(PNPM) verify
