# # Usa a imagem oficial do Node.js 20
# FROM node:20-alpine

# # Define o diretório de trabalho dentro do container
# WORKDIR /app

# # Copia os arquivos de definição de dependências
# COPY package.json yarn.lock ./

# # Instala as dependências usando Yarn
# RUN yarn install --frozen-lockfile

# # Copia o restante do código da aplicação
# COPY . .

# # Expõe a porta que a aplicação vai rodar
# EXPOSE ${PORT}

# # Define um argumento para o ambiente (padrão: desenvolvimento)
# ARG NODE_ENV=development
# ENV NODE_ENV=${NODE_ENV}

# # Comando para rodar a aplicação com base no ambiente
# CMD if [ "$NODE_ENV" = "production" ]; then \
#       yarn build && yarn start:prod; \
#     else \
#       yarn start:dev; \
#     fi