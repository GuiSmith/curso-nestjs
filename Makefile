include .env
export

up:
	docker compose up -d
psql:
	docker exec -it ${POSTGRES_HOST} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}
