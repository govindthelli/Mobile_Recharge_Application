#stage 1
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npx update-browserslist-db@latest --yes

COPY . .
RUN npm run build

#stage 2
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

#changing configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

#/usr/share/nginx/html  it is the path for nginx image to host any apps.so,we need to kept build files in it
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

#Actually nginx runs in backgroup but it is not a good approach because docker assumes that no process is running and it terminates everything.To avoid these we use daemon off
CMD ["nginx", "-g", "daemon off;"]




