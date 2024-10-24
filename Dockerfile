# Stage 1: Build the Vue.js app
FROM node:20.17.0-alpine as builder

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install --network-timeout 1000000000
COPY . .
RUN yarn build-only

# Stage 2: Serve the app with Node.js
FROM node:20.17.0-alpine

WORKDIR /app
COPY --from=builder /app/dist /app

RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Command to run the app
CMD ["serve", "-s", "/app", "-l", "3000"]
