import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpenAiChatComponent } from './open-ai-chat/open-ai-chat.component';
import { VoiceReconComponent } from './voice-recon/voice-recon.component';
import { TextToSpeechComponent } from './text-to-speech/text-to-speech.component';

@NgModule({
  declarations: [
    AppComponent,
    OpenAiChatComponent,
    VoiceReconComponent,
    TextToSpeechComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
     
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
