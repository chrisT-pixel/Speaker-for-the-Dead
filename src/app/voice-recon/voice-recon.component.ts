import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { VoiceReconService } from '..//voice-recon.service';
import { OpenAiChatComponent, textResponse } from '../open-ai-chat/open-ai-chat.component';
import { OpenaiService } from '../openai.service';
import { TextToSpeechComponent } from '../text-to-speech/text-to-speech.component';

let timeoutId: any;

@Component({
  selector: 'app-voice-recon',
  templateUrl: './voice-recon.component.html',
  styleUrls: ['./voice-recon.component.scss'],
  //providers: [VoiceReconService, OpenaiService]
   providers: [VoiceReconService]
})

//prob dont need text to speech child
export class VoiceReconComponent {
  @Input() data: any;
  @ViewChild(OpenAiChatComponent) public aiChat!: OpenAiChatComponent;
  @ViewChild(TextToSpeechComponent) public textToSpeech!: TextToSpeechComponent;

  promptString: string | undefined;
  responseString: string | undefined;
  //textList:textResponse[]=[{sno:1,text:'',response:''}];

  //constructor passes in its service and the chat component
  constructor(private service : VoiceReconService) { 
  //constructor(private service : VoiceReconService, public aiChat: OpenAiChatComponent ) { 

    this.service.init()

    //TODO: TRY AND ADD OPENAI SERVICE IN PROVIDERS THEN REWRITE THE METHOD
    // IN OPENAI COMPONENT TO WORK HERE 
    //THEN PASS PROMPTSTRING AND RESPONSESTRING DOWN TO OPENAI COMPONENT
    //SO THAT TEXT TO SPEECH COMPONENT GETS RESPONSESTRING AND THE 
    //HTML TEMPLATE THERE IS MODIFIED

    this.service.recognition.onresult = (event: any) => {
    
      clearTimeout(timeoutId);

      const lastResultIndex = event.results.length - 1;
      const lastResult = event.results[lastResultIndex][0].transcript;
      console.log(`Recognized: ${lastResult}`);

      //this.textList[0] = '';

      // start a new timeout to stop voice recon after 2 seconds of silence
      timeoutId = setTimeout(() => {
        this.stopService();
        console.log("prompt string " + this.promptString);
        console.log('Speech recognition stopped due to inactivity for 2 seconds');
        //TO DO: below is undefined
        //this.promptString = this.service.text;
        //this.aiChat.textList[0].sno = 1;
        this.aiChat.textList[0].text = this.promptString!;
        //this.responseString = this.aiChat.responseString;
    
        //this.aiChat.textList[0].response = this.aiChat.responseString;
        //console.log("this.aiChat.textList[0].response " + this.aiChat.responseString);

        //I should not need the commented out items above - below returns the response i need in the console but 
        //I cant pass it to the HTML template of OpenAIChat
        
        this.aiChat.generateText(this.aiChat.textList[0]); //MAIN METHOD NEEDED 
        
        //this.textToSpeech.responseString = this.aiChat.responseString;
        //console.log("text to speech response String " + this.textToSpeech.responseString);
        //this.aiChat.responseString = 
        
      }, 2000);
   
    };

  }

  ngOnInit(): void {
  }

  startService(){
    //make prompts empty strings
    this.promptString = '';
    this.service.text = '';
    this.service.start()
    
  }

  stopService(){
   this.service.stop();
    //after recording ends, pass voice to text to input box 
    this.promptString = this.service.text;
     
  }

  generateText(e: string){
    this.stopService();
  }


}
