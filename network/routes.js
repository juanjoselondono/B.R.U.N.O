const express = require('express');
const wiki = require('../modules/wiki/network');

const routes = (server)=>{
    server.use('/wiki', wiki)
}
module.exports = routes;