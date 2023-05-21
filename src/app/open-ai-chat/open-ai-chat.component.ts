import { Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { VoiceReconComponent } from '../voice-recon/voice-recon.component';
import { OpenaiService } from '../openai.service';
import { TextToSpeechComponent } from '../text-to-speech/text-to-speech.component';
import { CharacterComponent } from '../character/character.component';

export class textResponse{
  sno:number=1;
  text:string='';
  response:any='';
}

@Component({
  selector: 'app-open-ai-chat',
  templateUrl: './open-ai-chat.component.html',
  styleUrls: ['./open-ai-chat.component.scss']
})
export class OpenAiChatComponent {
   
  @ViewChild(TextToSpeechComponent) public textToSpeech!: TextToSpeechComponent;
  @ViewChild(CharacterComponent) public character!: CharacterComponent;
  @Input() promptString: string | undefined;
  @Input() responseString: string | undefined;
  @Output() stopRecording: EventEmitter<string> = new EventEmitter<string>();
  
  textList:textResponse[]=[{sno:1,text:'',response:''}];

  constructor(public openaiService: OpenaiService, public voiceRecon: VoiceReconComponent) {}

  generateText(data:textResponse) {
    
    //pass value taken in via voice recon to chatGPT api
    //! is a non-null assertion operator 
    data.text = this.voiceRecon.promptString!; 
    
    this.openaiService.generateText(data.text).then(text => {
     
      data.response = text;
      //set responseString to the response so we can pass to text to voice component
      this.responseString = data.response;
      document.getElementsByClassName("card-text")[0].textContent = this.responseString!;
      this.textToSpeech.responseString = this.responseString!;
      this.textToSpeech.detectResponseChanges();

      
      
      
      if(this.textList.length===data.sno){
        this.textList.push({sno:1,text:'',response:''});
      }
    });

    //stop voice recording here
    this.stopRecording.emit("stop recording");
    //make prompt empty string
    this.promptString = '';
    data.text = this.promptString;

  }
}
