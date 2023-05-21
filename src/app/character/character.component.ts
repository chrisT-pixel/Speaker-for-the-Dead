import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  
})

export class CharacterComponent {

  public unityInstance: any;

  ngOnInit() {

    //init unityInstance object with callback promise so we can interact with it via browser events

        //@ts-ignore
        this.unityInstance = createUnityInstance(document.querySelector("#unity-canvas"), {
          dataUrl: "/assets/UnityCharacter/Build/UnityCharacter.data",
          frameworkUrl: "/assets/UnityCharacter/Build/UnityCharacter.framework.js",
          codeUrl: "/assets/UnityCharacter/Build/UnityCharacter.wasm",
          streamingAssetsUrl: "StreamingAssets",
          companyName: "University of South Australia",
          productName: "Speaker For The Dead",
          productVersion: "1.0"
          
        }).then(this.unityInstance); //callback promise

        //this.PlayTalkingAnimation();
        
  } 

  //call an animation script (PlayCharacterThinking) on our Male character in the Unity environment
  public PlayThinkingAnimation(): void {
  
    console.log("calling PlayAnimation()");

    this.unityInstance.then((unityInstanceAfter: any) => {
      unityInstanceAfter.SendMessage("Male_Adult_03_facial", "PlayCharacterThinking", "");
    }).catch((error: any) => {
      console.error(error);
    });
  }

  //call an animation script (PlayCharacterIdle) on our Male character in the Unity environment
  public PlayIdleAnimation(): void {
  
    console.log("calling PlayIdleAnimation()");

    this.unityInstance.then((unityInstanceAfter: any) => {
      unityInstanceAfter.SendMessage("Male_Adult_03_facial", "PlayCharacterIdle", "");
    }).catch((error: any) => {
      console.error(error);
    });
  }

  //call an animation script (PlayCharacter) on our Male character in the Unity environment
  public PlayTalkingAnimation(): void {
  
    console.log("calling PlayTalkingAnimation()");

    this.unityInstance.then((unityInstanceAfter: any) => {
      unityInstanceAfter.SendMessage("Male_Adult_03_facial", "PlayCharacterTalking", "");
    }).catch((error: any) => {
      console.error(error);
    });
  }


}


