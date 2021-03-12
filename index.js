const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const paginate = require('express-paginate');
const config = require('./config');

const postRoutes = require('./routes/post');
const imageUploadRoutes = require('./routes/images');
const userRoutes = require('./routes/users');
const infoRoutes = require('./routes/info');
const commentsRoutes = require('./routes/comments');

const app = express();

mongoose.connect(
  `mongodb+srv://${config.DB_USER}:${config.DB_SECRET}@${config.DB_HOST}/${config.DB_NAME}?retryWrites=true&w=majority`,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
);

//db.posts.createIndex( { "title": "text", "details": "text", "county": "text", "stories":"text", "suggestedFunctions": "text", "comments": "text"} )

var allowlist = [
  'http://localhost:8080',
  'https://patrimonioesquecido.ruilebre.com',
  'https://lostheritage.ruilebre.com'
];

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate));
app.use(cors());
app.use(paginate.middleware(10, 50)); // limit, maxLimit
app.use(bodyParser.json());

app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/image', imageUploadRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/infos', infoRoutes);
app.use('/api/v1/comments', commentsRoutes);

app.listen(process.env.PORT || 3000, function () {
  console.log('Server running');
});
