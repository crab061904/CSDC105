const express=require('express')
const path=require('path')

const router=express.Router();

router.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'../index.html'))
})
router.get('/calculator', (req, res) => {
    res.sendFile(path.join(__dirname, '../calculator/index.html'));
});
router.get('/placeholder', (req, res) => {
    res.sendFile(path.join(__dirname, '../placeholder/index.html'));
});

router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../notes/index.html'));
});


module.exports=router