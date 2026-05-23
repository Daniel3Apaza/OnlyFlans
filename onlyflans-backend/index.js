const app = require('./src/app');
const { syncDB } = require('./src/models');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await syncDB();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Ambiente: desarrollo`);
    });
  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
  }
};

start();