FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN yarn
CMD ["yarn", "run", "start"]
EXPOSE 3000