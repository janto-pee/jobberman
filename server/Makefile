postgres:
	docker run --name postgres12 -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:12-alpine

createdb:
	docker exec -it postgres12 createdb --username=root --owner=root recruitmentplatform

dropdb:
	docker exec -it postgres12 dropdb recruitmentplatform

migrateup:
	migrate -path server/src/data-source.ts -database "postgresql://root:secret@localhost:5432/HLS?sslmode=disable" -verbose up

migratedown:
	migrate -path server/src/data-source.ts -database "postgresql://root:secret@localhost:5432/HLS?sslmode=disable" -verbose down

sqlc:
	sqlc generate

.PHONY: postgres createdb dropdb migrateup migratedown generate

    # "typeorm": "typeorm-ts-node-commonjs",
    # "schema:sync": "npx typeorm-ts-node-commonjs schema:sync",
    # "typeorm:cache": "npx typeorm-ts-node-commonjs cache:clear",
    # "schema:drop": "npx typeorm-ts-node-commonjs -d ./src/database/data-source.ts",
    # "migration:create": "typeorm migration:create ./src/migrations/schema-update",
    # "migration:generate": "npx typeorm-ts-node-commonjs migration:generate ./src/migrations/schema-update -d ./src/database/data-source.ts",
    # "migration:show": "npx typeorm-ts-node-commonjs migration:show -d ./src/database/data-source.ts",
    # "migration:run": "npx typeorm-ts-node-commonjs migration:run -d  ./src/database/data-source.ts",
    # "migration:revert": "npx typeorm-ts-node-commonjs migration:revert -d ./src/database/data-source.ts"