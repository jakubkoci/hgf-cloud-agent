FROM node:16-alpine AS build

# Set NODE_ENV to development so yarn also installs dev dependencies (for build)
ENV NODE_ENV=development

ARG CLOUD_AGENT_API_URL

WORKDIR /usr/src/app

COPY package.json ./

# Install all dependencies for build
RUN yarn install

COPY . .

RUN CLOUD_AGENT_API_URL=${CLOUD_AGENT_API_URL} yarn build

FROM nginx

COPY --from=build /usr/src/app/out /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80