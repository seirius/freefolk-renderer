FROM node:12.13.1-alpine as build

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install
RUN npm run build

FROM nginx as web-server

COPY --from=build /usr/src/app/nginx/conf.d /etc/nginx/conf.d
COPY --from=build /usr/src/app/dist /var/www/freefolk.media