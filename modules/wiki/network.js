const { Router } = require('express');
const wiki = require('wikijs').default
const express = require('express');
const response = require('../../network/response');
const router = express.Router();

router.get('/summary',(req, res)=>{
    var key = req.query.key
    var bind = req.query.bind
    if(!key){
        res.status(400)
    }
    else{
        wiki({ apiUrl: 'https://en.wikipedia.org/w/api.php' })
        .page(key)
        .then(page => page.summary(bind))
        .then((data)=>{
            response.success(req, res, 200, data)
        })
        .catch((err)=>{
            response.error(req, res, 400, '[wiki/network] sentence not defined')
        })
    }
})
router.get('/info',(req,res)=>{
    var key = req.query.key
    if(!key){
        res.status(400)
    }
    else{
        console.log(key)
        wiki({ apiUrl: 'https://en.wikipedia.org/w/api.php' })
        .page(key)
        .then(page => page.info())
        .then((data)=>{
            response.success(req, res, 200, data)
        });
    }
})
router.get('/image', (req,res)=>{
    var key = req.body.key
    if(!key){
        res.status(400)
    }
    else{
        wiki({ apiUrl: 'https://en.wikipedia.org/w/api.php' })
        .page(key)
        .then(page => page.mainImage())
        .then((data)=>{
            response.success(req, res, 200, data)
        });
    }
})
module.exports = router