import { Component, Input, Output, OnInit } from '@angular/core';
//import { OpenAiChatComponent } from '../open-ai-chat/open-ai-chat.component';
import { VoiceReconComponent } from '../voice-recon/voice-recon.component';

interface RecommendedVoices {
	[key: string]: boolean;
}

@Component({
  selector: 'app-text-to-speech',
  templateUrl: './text-to-speech.component.html',
  styleUrls: ['./text-to-speech.component.scss']
})
export class TextToSpeechComponent implements OnInit {

	@Input() responseString: string | undefined;

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

		// These are "recommended" in so much as that these are the voices that I (Chris)
		// could understand most clearly.
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

	// I demo the currently-selected voice.
	public demoSelectedVoice() : void {

		if ( ! this.selectedVoice ) {
			console.warn( "Expected a voice, but none was selected." );
			return;
		}

		var demoText = "Best wishes and warmest regards.";

		this.stop();
		this.synthesizeSpeechFromText( this.selectedVoice, this.selectedRate, demoText );

	}


	// I get called once after the inputs have been bound for the first time.
	public ngOnInit() : void {

		this.detectResponseChanges();
		this.voices = speechSynthesis.getVoices();
		this.selectedVoice = ( this.voices[ 0 ] || null );
		this.updateSayCommand();

		// The voices aren't immediately available (or so it seems). As such, if no
		// voices came back, let's assume they haven't loaded yet and we need to wait for
		// the "voiceschanged" event to fire before we can access them.
		if ( ! this.voices.length ) {

			speechSynthesis.addEventListener(
				"voiceschanged",
				() => {

					this.voices = speechSynthesis.getVoices();
					this.selectedVoice = ( this.voices[ 0 ] || null );
					this.updateSayCommand();

				}
			);

		}

	}


	// I synthesize speech from the current text for the currently-selected voice.
	public speak() : void {

		//if ( ! this.selectedVoice || ! this.text ) {

		//	return;

		//}

		//console.log("selected voice is " + this.selectedVoice?.name);
		//alert("speak is being called NOW");

		this.stop(); 
		//index of voices[51] is of UK male
		this.synthesizeSpeechFromText( this.voices[51], this.selectedRate, this.responseString! );
		// BUG voice stopping too early: https://bugs.chromium.org/p/chromium/issues/detail?id=335907
		//BUG only speaking on second push of button

	}


	// I stop any current speech synthesis.
	public stop() : void {

		if ( speechSynthesis.speaking ) {

			speechSynthesis.cancel();

		}

	}


	// I update the "say" command that can be used to generate the a sound file from the
	// current speech synthesis configuration.
	public updateSayCommand() : void {
		
		if ( ! this.selectedVoice || ! this.text ) {
			return;
		}

		// With the say command, the rate is the number of words-per-minute. As such, we
		// have to finagle the SpeechSynthesis rate into something roughly equivalent for
		// the terminal-based invocation.
		var sanitizedRate = Math.floor( 200 * this.selectedRate );
		var sanitizedText = this.text
			.replace( /[\r\n]/g, " " )
			.replace( /(["'\\\\/])/g, "\\$1" )
		;

		this.sayCommand = `say --voice ${ this.selectedVoice.name } --rate ${ sanitizedRate } --output-file=demo.aiff "${ sanitizedText }"`;

	}

	// ---
	// PRIVATE METHODS.
	// ---

	// I perform the low-level speech synthesis for the given voice, rate, and text.
	private synthesizeSpeechFromText(voice: SpeechSynthesisVoice, rate: number, text: string) : void {
		
		//console.log("response string at time of speech call " + this.responseString);
		var myTimeout: any;
		var utterance = new SpeechSynthesisUtterance(this.responseString);
		//utterance.voice = this.selectedVoice;
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

 	detectResponseChanges() {
    	
		//const div = document.querySelector('.responseStringWrapper');
		const div = document.querySelector('.ai-response-text');
    	const config = { characterData: true, attributes: true, childList: true, subtree: true };
   	    const observer = new MutationObserver((mutation) => {
      		console.log("div style changed");
			this.speak();
   		 })
    observer.observe(div!, config);
  }

}
