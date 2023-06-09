import { Component, Input, Output, OnInit, ViewChild } from '@angular/core';
import { VoiceReconComponent } from '../voice-recon/voice-recon.component';
import { CharacterComponent } from '../character/character.component';


interface RecommendedVoices {
	[key: string]: boolean;
}

@Component({
  selector: 'app-text-to-speech',
  templateUrl: './text-to-speech.component.html',
  styleUrls: ['./text-to-speech.component.scss']
})
export class TextToSpeechComponent implements OnInit {

	//inter-component communication
	@Input() responseString: string | undefined;
	@ViewChild(CharacterComponent) public character!: CharacterComponent;

  	public sayCommand: string;
	public recommendedVoices: RecommendedVoices;
	public rates: number[];
	public selectedRate: number;
	public selectedVoice: SpeechSynthesisVoice | null;
	public text: string;
	public voices: SpeechSynthesisVoice[];
	public myTimeout: any;

	// initialize the app component, pass in voice recon
	constructor(private voiceRecon: VoiceReconComponent) {

		this.voices = [];
		this.rates = [ .25, .5, .75, 1, 1.25, 1.5, 1.75, 2 ];
		this.selectedVoice = null;
		this.selectedRate = 1;
		this.text = this.responseString!;
		this.sayCommand = "";

		// Voices that speak clearly - can be useful if creating different characters that depend on this API
		this.recommendedVoices = Object.create( null );
		this.recommendedVoices[ "Alex" ] = true;
		this.recommendedVoices[ "Alva" ] = true;
		this.recommendedVoices[ "Damayanti" ] = true;
		this.recommendedVoices[ "Daniel" ] = true;
		this.recommendedVoices[ "Fiona" ] = true;
		this.recommendedVoices[ "Fred" ] = true;
		this.recommendedVoices[ "Karen" ] = true;
		this.recommendedVoices[ "Mei-Jia" ] = true;
		this.recommendedVoices[ "Melina" ] = true;
		this.recommendedVoices[ "Moira" ] = true;
		this.recommendedVoices[ "Rishi" ] = true;
		this.recommendedVoices[ "Samantha" ] = true;
		this.recommendedVoices[ "Tessa" ] = true;
		this.recommendedVoices[ "Veena" ] = true;
		this.recommendedVoices[ "Victoria" ] = true;
		this.recommendedVoices[ "Yuri" ] = true;

	}

	// ---
	// PUBLIC METHODS.
	// ---

	//explicitly bound function, recursive call to pause and resume speechSynthesis every 14 seconds to 
	//fix known bug with speech longer than 15 seconds
	public resetSpeech = () => { 
        speechSynthesis.pause();
        speechSynthesis.resume();
        this.myTimeout = setTimeout(this.resetSpeech, 14000);
    }

	// this is called only once after all inputs have been bound initially
	public ngOnInit() : void {

		this.detectResponseChanges();
		this.voices = speechSynthesis.getVoices();
		this.selectedVoice = ( this.voices[ 0 ] || null );
		
		//if no voices are returned, assume they haven't loaded yet and waiting for
		// the "voiceschanged" event to fire is necessary before we can access them.
		if ( ! this.voices.length ) {

			speechSynthesis.addEventListener(
				"voiceschanged",
				() => {
					//TODO: note this returns all voices - would be more efficient to just get the voice we need
					this.voices = speechSynthesis.getVoices();
					this.selectedVoice = ( this.voices[ 0 ] || null );
				}
			);
		}
	}


	// Synthesize speech from the current text for the currently-selected voice.
	public speak() : void {
		
		this.stop(); 
		//index of voices[51] is of UK male
		this.synthesizeSpeechFromText( this.voices[51], this.selectedRate, this.responseString! );

	}


	// I stop any current speech synthesis.
	public stop() : void {

		if ( speechSynthesis.speaking ) {
			speechSynthesis.cancel();
		}

	}


	// ---
	// PRIVATE METHODS.
	// ---

	// Perform the low-level speech synthesis for the given voice, rate, and text.
	private synthesizeSpeechFromText(voice: SpeechSynthesisVoice, rate: number, text: string) : void {
		
		var myTimeout: any;
		var utterance = new SpeechSynthesisUtterance(this.responseString);
		utterance.voice = this.voices[51]; //index 51 is of UK male
		utterance.rate = rate;

		// Listen for the 'end' event and perform an action
		utterance.addEventListener('end', () => {
  			//restart the voice recon service after the bot stops speaking
			this.voiceRecon.startService();
		});

		speechSynthesis.cancel();
        myTimeout = setTimeout(this.resetSpeech, 14000);
        utterance.onend =  function() { clearTimeout(myTimeout); }
		speechSynthesis.speak( utterance );
	

	}

	//detect changes that occur to a target div. If this div changes, we know that OpenAI has returned our answer
 	detectResponseChanges() { 
    
		const div = document.querySelector('.ai-response-text');
    	const config = { characterData: true, attributes: true, childList: true, subtree: true };
   	    const observer = new MutationObserver((mutation) => {
      		console.log("div style changed");
			this.speak();
   		 })
    observer.observe(div!, config);
  }

}
