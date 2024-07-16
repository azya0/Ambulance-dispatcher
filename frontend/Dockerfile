FROM node:20.15.1

WORKDIR /frontend

COPY package.json /frontend/package.json

RUN npm install --only=prod

COPY . /frontend

RUN npm run build

EXPOSE 3000

RUN npm install -g serve

CMD ["serve", "-s", "build"]
