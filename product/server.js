require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const Article = require('./models/blog.model');  // Import Article model
const app = express();

// Import the Article router
const ArticleRouter = require('./router/index');

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(morgan('tiny'));

// Route Handling
app.use('/articles', ArticleRouter);

// Home page
app.get('/', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: 'desc' }); // Fetch articles from the DB
    res.render('articles/index', { articles: articles }); // Render the index page with articles
  } catch (error) {
    console.log('Error fetching articles:', error);
    res.status(500).send('Error fetching articles');
  }
});

// About page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// About page redirect
app.get('/about-us', (req, res) => {
  res.redirect('/about');
});

// 404 Error page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database!');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.log('Connection Failed!', error);
  });
