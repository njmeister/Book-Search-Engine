const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect( "mongodb+srv://njmeister99:plj2wCkkuYtn2NTg@cluster1.jkdjlax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = mongoose.connection;
