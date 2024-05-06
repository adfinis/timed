.DEFAULT_GOAL := help

ORCHESTRATOR = docker
-include Makefile.local

# to use podman create a Makefile.local (will be ignored by vcs) and add the following line to it:
# ORCHESTRATOR := podman

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort -k 1,1 | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: start
start: ## Start the application
	@$(ORCHESTRATOR) compose up -d --build

.PHONY: stop
stop: ## Stop the application
	@$(ORCHESTRATOR) compose stop

.PHONY: backend-lint
backend-lint: ## Lint the backend
	@$(ORCHESTRATOR) compose run --rm backend sh -c "ruff format --check . && ruff check . --output-format=full"

.PHONY: backend-lint-fix
backend-lint-fix: ## Lint and fix the backend code
	@$(ORCHESTRATOR) compose run --rm backend sh -c "ruff format . && ruff check . --fix"

.PHONY: backend-test
backend-test: ## Test the backend
	@$(ORCHESTRATOR) compose run --rm backend pytest --no-cov-on-fail --cov

.PHONY: backend-dbshell
backend-dbshell: ## Start a psql shell
	@$(ORCHESTRATOR) compose run -it --rm db psql -Utimed timed

.PHONY: shellplus
shellplus: ## Run shell_plus
	@$(ORCHESTRATOR) compose run -it --rm backend ./manage.py shell_plus

.PHONY: makemigrations
makemigrations: ## Make django migrations
	@$(ORCHESTRATOR) compose run --rm backend ./manage.py makemigrations

.PHONY: backend-migrate
migrate: ## Migrate django
	@$(ORCHESTRATOR) compose run --rm backend ./manage.py migrate

.PHONY: backend-debug-backend
backend-debug-backend: ## Start backend container with service ports for debugging
	@$(ORCHESTRATOR) compose run --use-aliases --service-ports backend

.PHONY: flush
flush: ## Flush database contents
	@$(ORCHESTRATOR) compose run --rm backend ./manage.py flush --no-input

.PHONY: loaddata
loaddata: flush ## Loads test data into the database
	@$(ORCHESTRATOR) compose run --rm backend ./manage.py loaddata timed/fixtures/test_data.json

.PHONY: frontend-lint
frontend-lint: ## Lint the frontend
	@cd frontend && pnpm run lint

.PHONY: frontend-lint-fix
frontend-lint-fix: ## Lint and fix the frontend
	@cd frontend && pnpm run lint:fix

.PHONY: frontend-test
frontend-test: ## Run frontend tests
	@cd frontend && pnpm run test

.PHONY: keycloak-import
keycloak-import: ## Import keycloak configuration
	@$(ORCHESTRATOR) compose exec keycloak /opt/keycloak/bin/kc.sh import --override true --file /opt/keycloak/data/import/config.json

.PHONY: keycloak-export
keycloak-export: ## Export keycloak configuration
	@$(ORCHESTRATOR) compose exec keycloak /opt/keycloak/bin/kc.sh export --file /opt/keycloak/data/import/config.json
