# How to run

### Overall architecture
We leverage an elastic search instance to store crypto currencies market data from http://coinmarketcap.com/ crawled using a pupetter recurrent job that runs every 5min. 

The react based frontend requests data from an expressjs based backend which by its turn fetches data from elastic search.

### using docker-compose (easier way)
at the root of the project:

> docker-compose build
> docker-compose up

This will build the crawler, backend, frontend and will set up an elastic search instance 

Then you can point your browser to http://localhost:80

### using npm
First ensure you have a running elastic search instance. Then:

Inside the backend folder:
> npm run start:dev

Inside the frontend folder:
> npm start

Inside the crawler folder:
> npm run start:dev

### Tech stack
Nodejs v15
Typescript
React
pupetter
elastic search v7.11

