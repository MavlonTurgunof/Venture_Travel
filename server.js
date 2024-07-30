const app = require('./app');
const dbConnect = require('./config/DBContext');
const dotenv = require('dotenv').config();

dbConnect();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
