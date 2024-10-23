FROM node:20-alpine
EXPOSE 3000
# Installera beroenden
WORKDIR /app
RUN npm install
# Kopiera resten av projektet
COPY . .
# Bygg applikationen för produktion
RUN npm run build
# Installera ett enkelt verktyg för att servera statiska filer
RUN npm install -g serve
ENV DEBUG='client:*'
# Kör produktionsservern
CMD ["npm", "run", "dev"]