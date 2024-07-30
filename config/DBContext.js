const { default: mongoose } = require('mongoose');

const dbConnect = () => {
  try {
    conn = mongoose.connect(process.env.MONGO_URL);
    console.log('Database connected Successfully');
  } catch (error) {
    console.log('Database Error');
  }
};

module.exports = dbConnect;
