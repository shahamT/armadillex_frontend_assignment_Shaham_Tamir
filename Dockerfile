# build stage
FROM nginx:alpine as build-stage
RUN apk add --update npm

WORKDIR /app

ARG ENV_MODE
ARG API_URL

ENV ENV_MODE=$ENV_MODE
ENV API_URL=$API_URL

# Build argument for cache busting - update its value to force reinstallation of packages
ARG CACHEBUST=3
RUN echo "Cache bust: $CACHEBUST"

# Log mode (for debugging)
RUN echo "Building for mode: $ENV_MODE"

COPY . ./

RUN npm install

RUN npm install -g @quasar/cli

RUN quasar build

# Log mode (for debugging)
RUN echo "Building for mode: $ENV_MODE"

# Run Quasar build with the correct environment
RUN MODE=$ENV_MODE quasar build

FROM nginx:alpine as production-stage
ENV PORT=8080

COPY --from=build-stage /app /usr/share/nginx/html
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
COPY --from=build-stage /app/deployment/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
