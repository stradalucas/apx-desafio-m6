import { Router } from "@vaadin/router";
import { state } from "../../state";


   class initShareNewRoom extends HTMLElement {

      connectedCallback() {

         this.render();
         
         state.subscribe(() => {
            const { namePlayer2 } = state.getState();
            // 
            if (namePlayer2 != false && namePlayer2 != undefined) {
               Router.go("/rules");
            }
         });
      }

      render(): void {
         const { roomId } = state.getState();

         this.innerHTML = `
            <div class="text__container">
               <h2 class="text">Compartí el código:</h2>
               <h1 class="text code__room-id">${roomId}</h1>
               <h2 class="text">Con tu contrincante</h2>
            </div>

            <div class="hands">
               <hand-scissor></hand-scissor>
               <hand-stone></hand-stone>
               <hand-paper></hand-paper>
            </div>
            `;
            
         this.className = "share-romm-id";

         const style = document.createElement("style");
         style.innerText = `
               .share-romm-id {
                  width: 100%;
                  height: 100vh;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
               }
               .text__container {
                  font-family: var(--font-odibee-sans);
                  height: 75vh;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  row-gap: 2vh;
               }
               .text {
                  font-weight: 600;
                  font-size: 5vh;
                  margin: 0
               }
               .code__room-id {
                  font-size: 6.5vh;
               }
               .hands {
                 width: 100%;
                 display: flex;
                 justify-content: center;
                 column-gap: 5vw;
                 margin-bottom: -5vh
               }
         `;

         this.appendChild(style);
      }
   }
   customElements.define("newroom-page",initShareNewRoom);
