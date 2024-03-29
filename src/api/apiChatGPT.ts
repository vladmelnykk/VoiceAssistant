import axios from 'axios';
import {apiKey} from '../constants/apiKey';

export interface IMessages {
  role: string;
  content: string;
}

export const client = axios.create({
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
});

const chatGptEndpoint = 'https://api.openai.com/v1/chat/completions';
const dalleEndpoint = 'https://api.openai.com/v1/images/generations';

const chatGptApiCall = async (prompt: string, messages: IMessages[]) => {
  try {
    const response = await client.post(chatGptEndpoint, {
      model: 'gpt-3.5-turbo',
      messages,
    });

    let answer = response.data.choices[0].message?.content;
    console.log('response chatGptApiCall: ', answer);

    return {success: true, message: answer};
  } catch (error: any) {
    console.log('error chatGptApiCall: ', error);
    return {success: false, message: error};
  }
};

const dalleApiCall = async (prompt: string, messages: IMessages[]) => {
  try {
    const response = await client.post(dalleEndpoint, {
      prompt,
      n: 1,
      size: '512x512',
    });

    let url = response.data.data[0].url;
    console.log('response dalleApiCall: ', url);

    return {success: true, message: url};
  } catch (error) {
    console.log('error dalleApiCall : ', error);
    return {success: false, message: error};
  }
};

export const chatGptApi = async (prompt: string, messages: IMessages[]) => {
  try {
    const response = await client.post(chatGptEndpoint, {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Does this message want to generate an AI picture, image, art or anything similar?. Just answer yes or no. This message -'${prompt}'. Just answer yes or no`,
        },
      ],
    });

    console.log(
      'response chatGptApi: ',
      response.data.choices[0].message?.content,
    );
    if (
      response.data.choices[0].message?.content.toLowerCase().includes('yes')
    ) {
      return await dalleApiCall(prompt, messages || []);
    } else {
      return await chatGptApiCall(prompt, messages || []);
    }
  } catch (error) {
    console.log('error chatGptApi: ', error);
    return {success: false, message: error};
  }
};
