const { db } = require('../server/db');
const PORT = process.env.PORT ?? 8080;
const app = require('../server');

const init = async () => {
  try {
    await db.sync();
    app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`));
  } catch (ex) {
    console.log(ex);
  }
};

init();
