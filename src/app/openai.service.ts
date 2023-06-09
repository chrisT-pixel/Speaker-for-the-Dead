import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';

@Injectable({
  providedIn: 'root'
})

export class OpenaiService {
  
  private openai: OpenAIApi;
  private conversationHistory: string[] = [];
  
  configuration = new Configuration({
    apiKey: "XXXXX",
  });

  constructor() {
    this.openai = new OpenAIApi(this.configuration);
  }

  /*generateText(prompt: string):Promise<string | undefined>{
   return this.openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 256,
        temperature: 0.1
      }).then(response => {
        return response.data.choices[0].text;
      }).catch(error=>{
        return '';
      });
  }*/

  generateText(prompt: string): Promise<string | undefined> {
    
    const conversationPrompt = this.getConversationPrompt(prompt);

    // Construct the system-level instruction - this requires tokens so we use sparingly
    const systemInstruction = `You are a university professor at the University of South Australia named Mark Billinghurst.`;

    //open ai API call 
    return this.openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${systemInstruction}\n${conversationPrompt}`,
      max_tokens: 256, //max is 4096 - this would allow for more detailed questions and answers for more $
      temperature: 0.1 //model will almost always select the highest probability word, but allowing for a bit of creativity
    })
      .then(response => { //manage the result or error of promise from OpenAI
        
        const generatedText = response.data.choices[0].text; //represents the test response from OpenAI
        this.updateConversationHistory(prompt, generatedText!);
        console.log(prompt);

        return generatedText;
      })
      .catch(error => {
        return '';
      });
  }

  //maintain the previous two prompts and responses in the current 
  //prompt so the model has some level of context for future responses
  //the more added to conversationPrompt, the more cost in tokens
  private getConversationPrompt(prompt: string): string {
    const lastTwoItems = this.conversationHistory.slice(-2);
    return lastTwoItems.concat(prompt).join('\n');
  }

  private updateConversationHistory(prompt: string, generatedText: string): void {
    this.conversationHistory = [prompt, generatedText];
  }

}
