require('dotenv').config();
const express=require("express")
const app =express()
const mongoose=require('mongoose')
const ArticleRouter=require('./router/index')
const Article=require('./models/blog.model')
const morgan=require('morgan')
const methodOverride = require('method-override')
app.set('view engine','ejs')


app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))

app.use(express.static(__dirname + '/public'));
app.use(morgan('tiny'))
app.use((req,res,next)=>{
    next();
})

app.use('/articles',ArticleRouter)
//Home Page
app.get('/', async (req,res) => {
  const articles= await Article.find().sort({createdAt:'desc'})
  res.render('articles/index', {articles:articles})
})

//About Page
app.get('/about', (req,res) => {
  res.render('about', {title: "About"})
})

//Redirect of about page
app.get('/about-us', (req,res) => {
  res.redirect('/about', {title: "About"})
})

//Page not FOUND
app.use((req, res) => {
  res.status(404).render('404', { title: "404" });
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.log("Connection Failed!", error);
  });



