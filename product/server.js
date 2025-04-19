require('dotenv').config();
const express=require("express")
const app =express()
const mongoose=require('mongoose')
const ArticleRouter=require('./router/index')
const morgan=require('morgan')

app.set('view engine','ejs')


app.use(express.urlencoded({extended:false}))


app.use(express.static(__dirname + '/public'));
app.use(morgan('tiny'))
app.use((req,res,next)=>{
    next();
})

app.use('/articles',ArticleRouter)
//Home Page
app.get('/', (req,res) => {
  const blogs = [     
    {title: 'Mia can lift ',createdAt:new Date(), snippet: 'Lorem ipsum dolor sit amet consectetur'},
    {title: 'Wala nang roads',createdAt:new Date(), snippet: 'Lorem ipsum dolor sit amet consectetur'},
    {title: 'Jonnie Confession',createdAt:new Date(), snippet: 'Lorem ipsum dolor sit amet consectetur'},
];
  res.render('articles/index', {title: "Home", blogs})
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
app.use('/',(req,res) => {
  res.status(404).render('404', {title: "404"})
})

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



