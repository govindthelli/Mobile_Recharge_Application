#stage 1
FROM node:latest AS build

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .
RUN npm run build

#stage 2
FROM nginx:latest

COPY --from=build /app/build /usrshare/nginx/html

EXPOSE 80

CMD ["nginx","-g","daemon off"]




