const { Router } = require('express');
const express = require('express');
const response = require('../../network/response');
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai")
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration)

router.get('/gpt3',(req, res)=>{
  var question = req.query.question
  const completion = openai.createCompletion({
    model:'text-davinci-003',
    prompt: question,
    max_tokens: 1000
  })

  console.info('cargando información ...')
  completion.then((r) =>{
    var answer = r.data.choices[0].text
    console.info(answer)
    response.success(req, res, 200, answer)
  })
})

module.exports = router