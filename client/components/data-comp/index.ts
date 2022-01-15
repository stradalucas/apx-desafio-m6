import { state } from "../../state";

customElements.define(
   "data-comp",
   class DataComp extends HTMLElement {
      shadow: ShadowRoot;
      constructor() {
         super();
         this.shadow = this.attachShadow({ mode: "open" });
         this.render();
      }
      render() {
         const { namePlayer1, namePlayer2, scorePlayer1, scorePlayer2, roomId } = state.getState();

         const div = document.createElement("div");
         div.innerHTML = `
            <div class="cont-name-score">
               <p>${namePlayer1}: ${scorePlayer1}</p>
               <p>${namePlayer2}: ${scorePlayer2}</p>
            </div>
            <div class="cont-room">
               <p>Sala</p>
               <p>${roomId}</p>
            </div>
         `;
         div.className = "data-comp";

         const style = document.createElement("style");
         style.innerText = `
            .data-comp {
               display: flex;
               justify-content: space-around;
               font-size: 3.5vh;
               font-family: var(--font-odibee-sans);
               width: 100vw;
            }

            p{
               margin:2vh 0;
            }
            `;

         this.shadow.appendChild(div);
         this.shadow.appendChild(style);
      }
   }
);
