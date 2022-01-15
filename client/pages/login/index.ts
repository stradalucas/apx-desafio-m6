import { Router } from "@vaadin/router";
import { state } from "../../state";

   class initLoginPage extends HTMLElement {

      connectedCallback() {

         const { rtdbRoomId } = state.getState() as { rtdbRoomId: string };

         if (rtdbRoomId != undefined) {
            state.suscribeRtdbRoom(rtdbRoomId);
         }

         this.render();

         const imageTitle = this.querySelector(".image-title");
         imageTitle.addEventListener("click", () => {
            Router.go("/");
         });

         const buttonStart = this.querySelector(".form__button-start");
         buttonStart.addEventListener("click", (e) => {
            e.preventDefault();

            const namePlayer = document
               .querySelector(".form__input-name")
               .shadowRoot.querySelector("input").value;

            state.newPlayer(namePlayer).then(() => {
               const {rtdbRoomId} = state.getState()
               state.authRoomStatus(rtdbRoomId).then((authRes) => {
                  // console.log(JSON.stringify(authRes));
                  const namePlayer1 = authRes.player1.namePlayer;
                  const namePlayer2 = authRes.player2.namePlayer;
      
                  if (namePlayer2 == false && namePlayer != namePlayer1) {
                     state.namePlayer2(namePlayer, rtdbRoomId).then(() => {
                        const currentState = state.getState();
      
                        state.setState({
                           ...currentState,
                           namePlayer,
                        });
                        
                        Router.go("/rules");
                     });
      
                  } else if (namePlayer == namePlayer1 || namePlayer == namePlayer2) {
                     const currentState = state.getState();
      
                     state.setState({
                        ...currentState,
                        namePlayer
                     });
      
                     Router.go("/rules");
                     
                  } else if (namePlayer != namePlayer1 || namePlayer != namePlayer2) {
                     console.log("El nombre no coincide con el de ninguno de los dos jugadores");

                     Router.go("/");
                  }
               });
            });

            });
         };

      render(): void {
         this.innerHTML = `
            <img-title class="image-title"></img-title>
            
            <form class="form">
                <input-comp type="text" class="form__input-name">Tu nombre</input-comp>
                <button-comp id="button-start" class="form__button-start">Empezar</button-comp>
            </form>

            <div class="hands">
               <hand-scissor></hand-scissor>
               <hand-stone></hand-stone>
               <hand-paper></hand-paper>
            </div>
         `;

         this.className = "this-login";

         const style = document.createElement("style");
         style.innerText = `

         .this-login {
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

         .hands {
            width: 100%;
            display: flex;
            justify-content: center;
            column-gap: 5vw;
            margin-bottom: -5vh
         }

         .form {
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
   customElements.define(
      "login-page", initLoginPage);
