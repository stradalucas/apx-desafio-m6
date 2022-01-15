import { Router } from "@vaadin/router";
import { state } from "../../state";

const movement : any = {
   paper: require("url:../../assets/papel.svg"),
   stone: require("url:../../assets/piedra.svg"),
   scissor: require("url:../../assets/tijera.svg")
}

   class initRoundPage extends HTMLElement {

      connectedCallback() {
         this.render();
      }

      render(): void {
         const {
            namePlayer,
            namePlayer1,
            namePlayer2,
            movePlayer1,
            movePlayer2,
         } = state.getState();

         let moveOpposingPlayer: string;
         let movePlayerMove: string;

         if (namePlayer == namePlayer1) {
            moveOpposingPlayer = movePlayer2;
            movePlayerMove = movePlayer1;
         }
         if (namePlayer == namePlayer2) {
            moveOpposingPlayer = movePlayer1;
            movePlayerMove = movePlayer2;
         }

         const moveOpposing = movement[moveOpposingPlayer];
         const movePlayer = movement[movePlayerMove];

          console.log(movePlayer);
          console.log(moveOpposing);

          if (namePlayer == namePlayer1) {
            this.innerHTML = `
            <img class="move rotate" src=${moveOpposing}>
            <img class="move" src=${movePlayer}>
            `;
         }
         if (namePlayer == namePlayer2) {
            this.innerHTML = `
            <img class="move rotate" src=${moveOpposing}>
            <img class="move" src=${movePlayer}>
            `;
         }

      this.className = "this-round";
        
      const style = document.createElement("style");

         style.innerText = `
            .this-round {
               width: 100%;
               height: 100vh;
               display: flex;
               align-items: center;
               flex-direction: column;
               justify-content: space-between;
            }
            .rotate {
               top:0px;
               transform: rotate(180deg);
               height: 45vh;
             }
             .move {
               bottom :0px;
               height: 45vh;
             }
         `;

         setTimeout(() => {
            Router.go("/results");
         }, 3500);
         
         this.appendChild(style);
      }

   }
   customElements.define("round-page", initRoundPage);
