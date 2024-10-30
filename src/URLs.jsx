// Kolla om applikationen körs i Docker genom att kolla om hostname är "server" eller "localhost"
const isDocker = window.location.hostname === 'localhost:8080';

console.log("Running via Docker: " + isDocker);

export const SERVER_API_URL = 'http://localhost:3001';

//export const SERVER_API_URL = isDocker ? 'http://server:3001' : 'http://localhost:3001'