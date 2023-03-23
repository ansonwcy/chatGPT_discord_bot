const { Configuration, OpenAIApi } = require("openai");
const { openAIKey } = require('../../config/config.json');

const configuration = new Configuration({
  apiKey: openAIKey,
});

const openai = new OpenAIApi(configuration);

async function createChatCompletion(history, completionSetting) {
  try {
    const response = await openai.createChatCompletion({
      model: completionSetting['model'],
      messages: history,
      temperature: completionSetting['temperature'],
      max_tokens: completionSetting['max_tokens'],
      top_p: completionSetting['top_p'],
      frequency_penalty: completionSetting['frequency_penalty'],
      presence_penalty: completionSetting['presence_penalty'],
    });
  
    return [true, response.data.choices[0].message.content]
  } catch(e) {
    console.log(`error occurs in createChatCompletion: ${e}`)
    return [false, e];
  }
}

module.exports = { createChatCompletion }