import { Router } from "@vaadin/router";
import { state } from "../../state";
const imgRules = require("url:../../assets/rules.svg");

   class initRulesPage extends HTMLElement {
      
      connectedCallback() {
         const { namePlayer, namePlayer1, namePlayer2, rtdbRoomId } = state.getState();

         if (namePlayer1 == namePlayer) {
            state.setReadyPlayers(namePlayer1, rtdbRoomId, false);
         }
         if (namePlayer2 == namePlayer) {
            state.setReadyPlayers(namePlayer2, rtdbRoomId, false);
         }

         this.render();

         state.subscribe(() => {
            const { readyPlayer1, readyPlayer2 } = state.getState();

            if (readyPlayer1 == true && readyPlayer2 == true) {
               Router.go("/election");
            }
         });
      }

      render(): void {
         this.innerHTML = `
            <data-comp></data-comp>

            <img class="image-rules" src="${imgRules}">
            
            <button-comp class="button-play">Jugar</button-comp>
            <move-comp></move-comp>
            `;
         this.className = "this-rules";

         const style = document.createElement("style");
         style.innerText = `
            .this-rules {
               width: 100%;
               height: 100vh;
               display: flex;
               flex-direction: column;
               justify-content: space-between;
               align-items: center;
            }
            .image-rules {
               height: 30vh;
            }
         `;

         this.appendChild(style);

         const { namePlayer, rtdbRoomId } = state.getState();

         const buttonPlay = this.querySelector(".button-play");
         buttonPlay.addEventListener("click", (e) => {
            e.preventDefault();
            // 
            state.setReadyPlayers(namePlayer, rtdbRoomId, true);
            // 
            this.waitingRoom();
         });
      }
      // 
      // 
      waitingRoom() {
         const { namePlayer, namePlayer1, namePlayer2 } = state.getState();

         let waitingPlayer: string;

         if (namePlayer == namePlayer1) {
            waitingPlayer = namePlayer2;
         }
         if (namePlayer == namePlayer2) {
            waitingPlayer = namePlayer1;
         }

         this.innerHTML = `
         <data-comp></data-comp>

         <p class="text-waitingPlayer">Esperando a que < ${waitingPlayer} > presione ¡Jugar!...</p>
         
         <move-comp></move-comp>
      `;
         this.className = "this-waiting";

         const style = document.createElement("style");
         style.innerText = `
            .this-waiting {
               width: 100%;
               height: 100vh;
               display: flex;
               flex-direction: column;
               justify-content: space-between;
               align-items: center;
            }
            .text-waitingPlayer {
               font-size: 7vh;
               font-family: var(--font-odibee-sans);
               text-align: center;
            }
         `;

         this.appendChild(style);
      }
   }

customElements.define("rules-page", initRulesPage);
