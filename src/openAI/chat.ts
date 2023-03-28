import { Configuration, OpenAIApi } from "openai";
import { ChatCompletion } from '../type'
import { getConfig } from '../utils/readConfig';

const configuration = new Configuration({
  apiKey: getConfig().openAIKey,
});

const openai = new OpenAIApi(configuration);

async function createChatCompletion(history: any, completionSetting: ChatCompletion): Promise<[boolean, string]> {
  completionSetting = convertNullToUndefine(completionSetting);
  try {
    const response = await openai.createChatCompletion({
      model: completionSetting.model,
      messages: history,
      temperature: completionSetting.temperature,
      max_tokens: completionSetting.max_tokens,
      top_p: completionSetting.top_p,
      frequency_penalty: completionSetting.frequency_penalty,
      presence_penalty: completionSetting.presence_penalty,
    });

    return [true, response.data.choices[0].message!.content];
  } catch (e) {
    console.log(`error occurs in createChatCompletion: ${e}`);
    return [false, `${e}`];
  }
}

async function createCompletion(message: any, completionSetting: ChatCompletion): Promise<[boolean, string]> {
  completionSetting = convertNullToUndefine(completionSetting);
  try {
    const response = await openai.createCompletion({
      model: completionSetting.model,
      prompt: message,
      temperature: completionSetting.temperature,
      max_tokens: completionSetting.max_tokens,
      top_p: completionSetting.top_p,
      frequency_penalty: completionSetting.frequency_penalty,
      presence_penalty: completionSetting.presence_penalty,
    });

    return [true, response.data.choices[0].text!];
  } catch (e) {
    console.log(`error occurs in createChatCompletion: ${e}`);
    return [false, `${e}`];
  }
}

// workaround for null
function convertNullToUndefine(obj: any): any {
  for (let prop in obj) {
    if (obj[prop] === null) {
      obj[prop] = undefined;
    }
  }
  return obj;
}

export { createChatCompletion, createCompletion };