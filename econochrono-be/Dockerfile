FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Set execute permissions for the scripts
RUN chmod +x ./wait-for-it.sh
RUN chmod +x start.sh

RUN npx prisma generate

EXPOSE 3001

# Conditionally initialize the database if INIT_DB is true, then always start the app
CMD ./wait-for-it.sh db:3306 --timeout=60 --strict -- ./start.sh
