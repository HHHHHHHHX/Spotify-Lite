const mongoose = require('mongoose');
const app = require('./app');

mongoose
  .connect(
    'mongodb+srv://dbUser:never123@cluster0.xmuoy7j.mongodb.net/spotify?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Connected to MongoDB successfully!');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB database:', error);
  });

app.listen(4000);

module.exports = app;
