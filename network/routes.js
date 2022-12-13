const express = require('express');
const wiki = require('../modules/wiki/network');
const openAI =  require("../modules/openAI/network")

const routes = (server)=>{
    server.use('/wiki', wiki)
    server.use('/openAI', openAI)
}
module.exports = routes;