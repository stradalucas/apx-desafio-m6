import { Router } from "@vaadin/router";
import { state } from "../../state";

   class initPlayGamePage extends HTMLElement {
      counter: number = 5;

      connectedCallback() {
         this.render();
      }

      render(): void {
         const { namePlayer, rtdbRoomId } = state.getState();

         this.innerHTML = `
            <div class="counter">
               <div class="counter-ellipse"></div>
               <div class="counter-el">${this.counter}</div>
            </div>

            <div class="hands">
               <hand-scissor class="scissor"></hand-scissor>
               <hand-stone class="stone"></hand-stone>
               <hand-paper class="paper"></hand-paper>
            </div>
         `;
         this.className = "this-election";

         const style = document.createElement("style");
         style.innerText = `
            .this-election {
               width: 100%;
               height: 100vh;
               display: flex;
               align-items: center;
               flex-direction: column;
               justify-content: space-between;
            }

            .counter {
               display: flex;
               flex-direction: column;
               align-items: center;
               justify-content: center;
            }

            .counter-ellipse {
               width: 30vh;
               height: 30vh;
               border-radius: 50%;
               border: 3vh solid hsl(7deg 7% 17% / 17%);
               border-top-color: #141414;
               display: flex;
               align-items: center;
               justify-content: center;
               animation: spin 1.5s linear infinite;
               position: relative;
               top: 12.5vh;
            }

            @keyframes spin {
               to {
                  transform: rotate(360deg);
               }
            }

            .counter-el {
               font-weight: bold;
               font-size: 10.7vh;
               font-family: var(--font-odibee-sans);
               position: relative;
               top:-8.7vh;
            }

            .scissor,
            .stone,
            .paper {
               height: 25vh;
            }

            .hands {
               width: 100%;
               display: flex;
               justify-content: center;
               column-gap: 5vw;
            }

            .active-hands {
               height: 30vh;
            }

            .actived {
               display: inherit;
               transform: translateY(-5vh);
               transition: all 0.5s;
            }

            .disabled {
               opacity: 0%;
               transform: translateY(5vh);
               transition: 1s;
            }
         `;

         const handsContaniner = this.querySelector(".hands").children;
         const countdownEl = this.querySelector(".counter-ellipse");

         for (const hands of handsContaniner) {
            hands.addEventListener("click", () => {
               const move = hands.getAttribute("class");

               if (move) {
                  state.setMovePlayer(move as any , namePlayer, rtdbRoomId).then(() => {
                     state.whoWins();
                  });
                  this.activateHands(move);
               }
               })
         }

         const countdown = setInterval(() => {
            const counterEl = this.querySelector(".counter-el");
            counterEl.textContent = String(this.counter);
            this.counter--;

            const {
               chosePlayer1,
               chosePlayer2,
            } = state.getState();

            if (this.counter == 0) {
               clearInterval(countdown);
               countdownEl.remove();

               if (chosePlayer1 == true && chosePlayer2 == true) {
                  Router.go("/round");

               } else if (chosePlayer1 == false || chosePlayer2 == false) {
                  Router.go("/rules");
               }
            }
         }, 1000);
         this.appendChild(style);
      }

         activateHands(param): void {
            const handsContaniner = this.querySelector(".hands").children;
            const hand : any = {
               scissor : this.querySelector(".scissor"),
               stone : this.querySelector(".stone"),
               paper : this.querySelector(".paper")
            }
   
            for (const hand of handsContaniner) {
               hand.classList.add("disabled");
            }

            if (param) {
               hand[param].classList.remove("disabled");
               hand[param].classList.add("actived");
            }
         }

   }
   customElements.define("election-page", initPlayGamePage);
