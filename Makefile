.DEFAULT_GOAL := help
SHELL := /bin/bash

# ---------------------------------------------------------------------------
# Help
# ---------------------------------------------------------------------------
help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ---------------------------------------------------------------------------
# Docker (full stack)
# ---------------------------------------------------------------------------
docker-up: ## Start all services (Backend + Frontend)
	docker compose down
	docker compose build --no-cache
	docker compose up -d

docker-down: ## Stop all services
	docker compose down

docker-logs: ## Tail logs from all services
	docker compose logs -f

docker-clean: ## Stop and remove volumes
	docker compose down -v

# ---------------------------------------------------------------------------
# Frontend (Next.js)
# ---------------------------------------------------------------------------
fe-install: ## Install frontend dependencies
	cd frontend && npm install

fe-dev: ## Start frontend dev server
	cd frontend && npm run dev

fe-build: ## Build frontend for production
	cd frontend && npm run build

fe-lint: ## Run frontend linter
	cd frontend && npm run lint

# ---------------------------------------------------------------------------
# Backend (Node.js + Hono)
# ---------------------------------------------------------------------------
be-install: ## Install backend dependencies
	cd backend && npm install

be-dev: ## Start backend dev server
	cd backend && npm run dev

be-build: ## Build backend for production
	cd backend && npm run build

be-lint: ## Run backend linter
	cd backend && npm run lint

# ---------------------------------------------------------------------------
# Smart Contract (Move / Sui)
# ---------------------------------------------------------------------------
sc-build: ## Build Tuskbase smart contract
	cd contracts/tuskbase && sui move build

sc-test: ## Run smart contract tests
	cd contracts/tuskbase && sui move test

sc-deploy: ## Deploy smart contract to testnet
	cd contracts/tuskbase && sui client publish --gas-budget 100000000

# ---------------------------------------------------------------------------
# Git
# ---------------------------------------------------------------------------
commit: ## Stage all and commit with prompt
	@git add .
	@git status
	@read -p "Commit message: " msg; \
	git commit -m "$$msg"

push: ## Push to remote (auto set upstream)
	@BRANCH=$$(git rev-parse --abbrev-ref HEAD); \
	if git config --get branch.$$BRANCH.remote > /dev/null 2>&1; then \
		git push; \
	else \
		echo "First push for branch '$$BRANCH', setting upstream..."; \
		git push -u origin $$BRANCH; \
	fi

.PHONY: help docker-up docker-down docker-logs docker-clean fe-install fe-dev fe-build fe-lint be-install be-dev be-build be-lint sc-build sc-test sc-deploy commit push
