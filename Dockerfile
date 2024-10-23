FROM node:20-alpine
EXPOSE 3000
# Installera beroenden
WORKDIR /app
# Kopiera resten av projektet
COPY . .
RUN npm install
# Installera ett enkelt verktyg för att servera statiska filer
RUN npm install -g serve
ENV DEBUG='client:*'
# Kör produktionsservern
CMD ["npm", "run", "dev"]