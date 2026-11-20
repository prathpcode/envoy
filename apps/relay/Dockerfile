# The relay has no dependencies: copy the modules and run them.
FROM node:22-alpine
WORKDIR /app
COPY package.json *.mjs ./
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.mjs"]
