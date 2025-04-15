#!/bin/bash

# Entrar no diretório client e executar o comando yarn start
cd client || { echo "Falha ao entrar no diretório 'client'"; exit 1; }
yarn start &

# Voltar ao diretório anterior
cd ..

# Entrar no diretório server e executar o comando node index.js
cd server || { echo "Falha ao entrar no diretório 'server'"; exit 1; }
node app.js
