const express=require('express')
const path=require('path')
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname,'view')))

//importing and using of routes
const pageRoutes=require('./routes/index.js')
app.use('/',pageRoutes)

//404 handler
app.use((req,res)=>{ 
    res.status(404).sendFile(path.join(__dirname,'view','404.html'))
})

//server start
app.listen(PORT,()=>{ 
    console.log(`Server running on http://localhost:${PORT}`)
})
