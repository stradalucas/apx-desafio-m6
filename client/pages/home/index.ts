import { Router } from "@vaadin/router";
import { state } from "../../state";

   class initHomePage extends HTMLElement {
      
      connectedCallback() {

         this.render();

         const buttonNewGame = this.querySelector(".button__new-game");
         buttonNewGame.addEventListener("click", (e) => {
            e.preventDefault();
            Router.go("/signup");
         });

         const buttonEnterRoom = this.querySelector(".button__enter-room");
         buttonEnterRoom.addEventListener("click", (e) => {
            e.preventDefault();
            Router.go("/enter_room");
         });

         const imageTitle = this.querySelector(".image-title");
         imageTitle.addEventListener("click", () => {
            Router.go("/");
         });
      }

      render(): void{
         this.innerHTML = `
            
            <img-title class="image-title"></img-title>
            
            <div class="button">
            <button-comp class="button__new-game">Nuevo juego</button-comp>
            <button-comp class="button__enter-room">Ingresar a una sala</button-comp>
            </div>

            <move-comp></move-comp>
            
            `;
         
         this.className = "this-home";

         const style = document.createElement("style");

         style.innerText = `
            .this-home {
               width: 100%;
               height: 100vh;
               display: flex;
               align-items: center;
               flex-direction: column;
               justify-content: space-evenly;
               padding: 0 1vw;
               row-gap: 5vh;
            }
            .image-title{
               height: 40vh;
               display: flex;
               align-items: end;
            }

            .button {
               display: flex;
               flex-direction: column;
               justify-content: center;
               row-gap: 3vh; 
               height: 35vh;
            }
            `;

         this.appendChild(style);
      }
   }
   customElements.define("home-page", initHomePage);
