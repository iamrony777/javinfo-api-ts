FROM oven/bun as base
WORKDIR /app

# copy files to images
COPY common /app/common
COPY providers /app/providers
COPY index.ts /app/index.ts
COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json

# bun setup
RUN bun install

ENV NODE_ENV production
EXPOSE 8080
CMD ["bun", "start"]