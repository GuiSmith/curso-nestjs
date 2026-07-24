include .env
export

up:
	docker compose up -d
down:
	docker compose down
psql:
	docker exec -it ${POSTGRES_HOST} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}
