#!/bin/bash

echo "🧹 Limpando banco de dados de teste..."

docker exec postgresAgroTest psql -U pguser -d agriculture_test -c "
TRUNCATE TABLE crop CASCADE;
TRUNCATE TABLE farm CASCADE;
TRUNCATE TABLE producer CASCADE;
" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Banco de dados limpo com sucesso!"
else
    echo "❌ Erro ao limpar banco de dados"
    exit 1
fi
