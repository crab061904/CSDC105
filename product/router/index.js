const express = require('express');
const router = express.Router();
const multer = require('multer');
const Article = require('../models/blog.model');
const slugify = require('slugify');
const { marked } = require('marked');  // For converting markdown to HTML
const createDomPurify = require('dompurify');  // For sanitizing HTML
const { JSDOM } = require('jsdom');  // For creating a window for dompurify

// Set up multer to use memory storage (so we can handle file as Buffer)
const storage = multer.memoryStorage();  // Store the image in memory (as Buffer)
const upload = multer({ storage: storage });  // Set up multer with memory storage

// Initialize Dompurify
const dompurify = createDomPurify(new JSDOM().window);

// Route for creating a new article (GET request to render the create form)
router.get('/create', (req, res) => {
  res.render('articles/create', { title: 'Create', article: new Article() });
});

// Route for editing an article (GET request to render the edit form)
router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render('articles/edit', { article: article });
});

// Route for viewing a specific article by slug (GET request)
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article == null) {
      return res.redirect('/');  // Redirect if article not found
    }
    res.render('articles/show', { article: article });  // Render the article view
  } catch (error) {
    res.status(500).send('Error fetching article');
  }
});

// Route for creating a new article (POST request to save the article)
router.post('/', upload.single('image'), async (req, res, next) => {
  console.log("Uploaded File: ", req.file);  // Log the uploaded file for debugging
  req.article = new Article();  // Create a new article document
  next();
}, saveArticleAndRedirect('create'));  // Change 'new' to 'create'

// Route for updating an existing article (PUT request to save the updated article)
// Route for updating an existing article (PUT request to save the updated article)
router.put('/:id', upload.single('image'), async (req, res, next) => {
  req.article = await Article.findById(req.params.id);  // Fetch the article by ID
  next();  // Move to the next middleware
}, saveArticleAndRedirect('edit'));

// Route for deleting an article (DELETE request)
router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);  // Delete the article from the database
  res.redirect('/');  // Redirect to homepage after deletion
});

// Route to fetch an image from the article document and send it in the response
router.get('/image/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);  // Find the article by ID

    // Check if the article exists and if it has an image
    if (!article || !article.image) {
      return res.status(404).send('Image not found.');  // Return 404 if image doesn't exist
    }

    // Set the content type (assuming JPEG image here; adjust if necessary)
    res.set('Content-Type', 'image/jpeg');  // Assuming image is in JPEG format, change if needed

    // Send the image buffer in the response
    res.send(article.image);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching image.');
  }
});

// Helper function to save the article and redirect
// Helper function to save the article and redirect
function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;

    // Debugging: Check if a file is uploaded
    if (req.file) {
      console.log("New image uploaded:", req.file);  // Log the uploaded file for debugging
      article.image = req.file.buffer;  // Store the uploaded image as a Buffer in the article document
    } else {
      console.log("No new image uploaded, retaining old image");
      article.image = article.image || null;  // If no new image is uploaded, retain the old image
    }

    // Handle markdown to sanitized HTML conversion
    if (req.body.markdown) {
      article.sanitizedHtml = dompurify.sanitize(marked(req.body.markdown));  // Sanitize markdown to HTML
    } else {
      article.sanitizedHtml = article.sanitizedHtml || null;  // Retain the old sanitized HTML if no new markdown
    }

    // Generate slug if not already set
    if (!article.slug) {
      article.slug = slugify(article.title, { lower: true, strict: true });
    }

    try {
      // Save the updated article
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);  // Redirect to the article's page after saving
    } catch (error) {
      console.error(error);
      res.render(`articles/${path}`, { title: 'Edit', article: article });  // Render the form again in case of an error
    }
  };
}


module.exports = router;
