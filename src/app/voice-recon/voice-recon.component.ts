import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { VoiceReconService } from '..//voice-recon.service';
import { OpenAiChatComponent, textResponse } from '../open-ai-chat/open-ai-chat.component';

let timeoutId: any;


@Component({
  selector: 'app-voice-recon',
  templateUrl: './voice-recon.component.html',
  styleUrls: ['./voice-recon.component.scss'],
  providers: [VoiceReconService],
})

export class VoiceReconComponent {
  
  @Input() data: any;
  @ViewChild(OpenAiChatComponent) public aiChat!: OpenAiChatComponent;
  
  promptString: string | undefined;
  responseString: string | undefined;
  statusMessage: string = 'Welcome to Speaker for the dead! Please initiate the chat session when you are ready by clicking the button above';
  statusClass: string = 'alert-primary';
  statusIcon: string = 'error_outline';
  isStartButtonDisabled: boolean = false;
  isStopButtonDisabled: boolean = true;


  //constructor passes in its service and the chat component
  constructor(private service : VoiceReconService) { 
 
    this.service.init()

    this.service.recognition.onresult = (event: any) => {
    
      clearTimeout(timeoutId);
      const lastResultIndex = event.results.length - 1;
      const lastResult = event.results[lastResultIndex][0].transcript;
      //console.log(`Recognized: ${lastResult}`);

      // start a new timeout to stop voice recon after 1 second of silence
      timeoutId = setTimeout(() => {
        
        this.stopService();
        //console.log("prompt string " + this.promptString);
        //console.log('Speech recognition stopped due to inactivity for 2 seconds');
        this.aiChat.textList[0].text = this.promptString!;
        this.aiChat.generateText(this.aiChat.textList[0]); //MAIN METHOD NEEDED 
        
      }, 1000);
   
    };

  }

  ngOnInit(): void {
  }

  startService(){
    //make prompts empty strings
    this.promptString = '';
    this.service.text = '';
    this.service.start()
    this.statusMessage = 'Clone is listening';
    this.statusClass = 'alert-success';
    this.statusIcon = 'hearing';
    this.isStartButtonDisabled = true;
    this.isStopButtonDisabled = false;

    
  }

  stopService(){
   this.service.stop();
    //after recording ends, pass voice to text to input box 
    this.promptString = this.service.text;
    this.statusMessage = 'Clone is speaking. Please wait until they are finished before responding';
    this.statusClass = 'alert-info';
    this.statusIcon = 'speaker_notes';
     
  }

  stopSession(){
   this.service.stop();
    //after recording ends, pass voice to text to input box 
    this.promptString = '';
    this.statusMessage = 'Ending chat session. Press the button above to initiate a new chat session';
    this.statusClass = 'alert-danger';
    this.statusIcon = 'warning';
    this.isStartButtonDisabled = false;
    this.isStopButtonDisabled = true;

     
  }

  generateText(e: string){
    this.stopService();
  }


}
