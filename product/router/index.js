const express = require('express');
const router = express.Router();
const Article = require("../models/blog.model.js");


router.get('/create', (req, res) => {
  res.render('articles/create', { title: "Create", article: new Article() });
});
router.get('/edit/:id', async(req, res) => {
  const article=await Article.findById(req.params.id)
    res.render('articles/edit', { article: article });
});



router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) return res.redirect('/');
  res.render('articles/show', { article: article });
});

router.post('/', async (req, res,next) => {
   req.article=new Article()
   next()
},saveArticleAndRedirect('new'));
router.put('/:id',async(req,res,next)=>{
  req.article=await Article.findById(req.params.id)
  next()
},saveArticleAndRedirect('edit'))
router.delete('/:id', async (req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})


function saveArticleAndRedirect(path){
  return async (req,res)=>{
   let article= req.article
     article.title= req.body.title
     article.description= req.body.description
     article.markdown=req.body.markdown
     try {
       // Save the article to the database
       article= await article.save();
       res.redirect(`/articles/${article.slug}`);
     } catch (error) {
       // If there's an error, render the create form with the current article object to show validation errors
       res.render(`articles/${path}`, { title: "Create", article: article });
     }
  }
}
module.exports = router;
