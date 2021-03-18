FROM node:15.5.0-alpine3.10 as build

COPY package* /srv/frontend/
COPY public /srv/frontend/public
COPY src /srv/frontend/src

WORKDIR /srv/frontend
RUN npm ci

ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL $REACT_APP_BACKEND_URL

RUN npm run build
RUN npm prune --production


FROM nginx:stable-alpine
COPY --from=build /srv/frontend/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

