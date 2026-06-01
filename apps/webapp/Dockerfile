#stage: builder
FROM node:alpine AS builder

#everything will be stored here build folder
WORKDIR /build    

COPY package* .
COPY ./prisma .

RUN npm install
RUN npx prisma generate

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]

#after main stage finished it will delete the builder things...

#stage: Main
FROM node:alpine AS runner

#copy the node_modules
COPY --from=builder /build/node_modules .
#copy the all package files
COPY --from=builder /build/package* .
#copy the dist folder
COPY --from=builder /build/dist .

CMD ["npm", "start"]