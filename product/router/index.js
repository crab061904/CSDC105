const express = require('express');
const router = express.Router();
const Article = require("../models/blog.model.js");

// Render create form with an empty article object
router.get('/create', (req, res) => {
  res.render('articles/create', { title: "Create", article: new Article() });
});

// Route for viewing an individual article (e.g., after it's created)
router.get('/:id', (req, res) => {
  // You might want to fetch the article by its ID here and render the article view
});

// Handle form submission for creating a new article
router.post('/', async (req, res) => {
    const article = new Article({
     title: req.body.title,
     description: req.body.description,
     markdown: req.body.markdown,
    });

    try {
      // Save the article to the database
      await article.save();
      res.redirect(`/articles/${article.id}`);
    } catch (error) {
      // If there's an error, render the create form with the current article object to show validation errors
      console.error('Error saving article:', error);
      res.render('articles/create', { title: "Create", article: article });
    }
});

module.exports = router;
