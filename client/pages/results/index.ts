import { Router } from "@vaadin/router";
import { state } from "../../state";
const resultImage = {
   tie: require("url:../../assets/empate.svg"),
   win: require("url:../../assets/ganaste.svg"),
   loose: require("url:../../assets/perdiste.svg"),
};

   class initResultsPage extends HTMLElement {

      connectedCallback() {
         const {rtdbRoomId } = state.getState();

         state.reset(rtdbRoomId);
         state.resetListener();

         this.render();
         
         const buttonBackToPlay = this.querySelector(".button-backToPlay");
         buttonBackToPlay.addEventListener("click", (e) => {
            e.preventDefault();
            Router.go("/rules");
         });
         
         const buttonResetScore = this.querySelector(".button-resetScore");
         buttonResetScore.addEventListener("click", (e) => {
            e.preventDefault();

            state.resetScore(rtdbRoomId)
            
            Router.go("/rules");

         });

         const buttonHome = this.querySelector(".button-home");
         buttonHome.addEventListener("click", () => {

            state.reset(rtdbRoomId);
            state.resetListener();
            state.resetScore(rtdbRoomId)

            Router.go("/");
         });

      }

      render() {
         const {  namePlayer,
                  namePlayer1,
                  namePlayer2,
                  scorePlayer1,
                  scorePlayer2,
                  winner } =
                              state.getState();

         let image: string;

         if (winner == "tied game") {
            image = resultImage.tie;
            this.style.backgroundColor = `rgba(106, 112, 101, 0.6)`;
         }
         if (winner == "player1") {
            if (namePlayer == namePlayer1) {
               image = resultImage.win;
               this.style.backgroundColor = `rgba(106, 146, 74, 0.6)`;
            }
            if (namePlayer == namePlayer2) {
               image = resultImage.loose;
               this.style.backgroundColor = `rgba(137, 73, 73, 0.6)`;
            }
         }
         if (winner == "player2") {
            if (namePlayer == namePlayer2) {
               image = resultImage.win;
               this.style.backgroundColor = `rgba(106, 146, 74, 0.6)`;
            }
            if (namePlayer == namePlayer1) {
               image = resultImage.loose;
               this.style.backgroundColor = `rgba(137, 73, 73, 0.6)`;
            }
         }

         this.innerHTML = `
            <img class="image-win" src="${image}">

            <div class="score-container">
               <h4>Puntuación</h4>
               <p>${namePlayer1}: ${scorePlayer1}<p>
               <p>${namePlayer2}: ${scorePlayer2}<p>
            </div>
            
            <div class="button-container">
               <button-comp class="button-backToPlay">Volver a jugar</button-comp>
               <button-comp class="button-resetScore">Reiniciar puntaje</button-comp>
               <button-comp class="button-home">Inicio</button-comp>
            </div>
          `;
         this.className = "this-results";

         const style = document.createElement("style");

         style.innerText = `
            .this-results {
               width: 100%;
               height: 100vh;
               display: flex;
               align-items: center;
               flex-direction: column;
               justify-content: space-evenly;
            }
            .image-win {
               width: 25vh;
            }
            .score-container {
               padding: 1.5vh;
               display: flex;
               border-radius: 1vh;
               background: #ffffff;
               flex-direction: column;
               border: 1.5vh solid #000000;
               font-family: var(--font-odibee-sans);
            }
            .score-container > h4 {
               font-size: 5vh;
               margin: 0 auto;
            }
            .score-container > p {
               margin: 0 1.5vh 0.7vh 0;
               font-size: 4vh;
               text-align: end;
            }
            .button-container{
               display: flex;
               flex-direction: column;
               justify-content: center;
               align-items: center;
               row-gap: 1.25vh;
            }
         `;

         
         this.appendChild(style);
      }
   }
   customElements.define("results-page", initResultsPage);