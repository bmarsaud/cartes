FROM nginx:alpine
COPY ./nginx/absolute-redirect.conf /etc/nginx/conf.d/absolute-redirect.conf
COPY ./dist /usr/share/nginx/html
