import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  
})

export class CharacterComponent {

  ngOnInit() {
        //@ts-ignore
        createUnityInstance(document.querySelector("#unity-canvas"), {
          dataUrl: "/assets/UnityCharacter/Build/UnityCharacter.data",
          frameworkUrl: "/assets/UnityCharacter/Build/UnityCharacter.framework.js",
          codeUrl: "/assets/UnityCharacter/Build/UnityCharacter.wasm",
          streamingAssetsUrl: "StreamingAssets",
          companyName: "University of South Australia",
          productName: "yourProjectName",
          productVersion: "1.0"
        });
  } 

}


