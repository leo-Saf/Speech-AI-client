// Kolla om applikationen körs i Docker genom att kolla om environment-variabeln IS_DOCKER är satt till true
const isDocker = process.env.IS_DOCKER === 'true';


console.log("Running via Docker: " + isDocker);

module.exports = {
  SERVER_API_URL: isDocker ? 'http://server:3001' : 'http://localhost:3001'
};