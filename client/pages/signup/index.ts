import { Router } from "@vaadin/router";
import { state } from "../../state";

   class initSignupPage extends HTMLElement {

      connectedCallback() {

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

               if(namePlayer != ""){

                  state.newRoom(namePlayer).then((res) => {
                     res.json().then((newRoom) => {

                        // console.log(JSON.stringify(newRoom));
                        
                        const currentState = state.getState();
                        const { roomId } = newRoom;
                        const { rtdbRoomId } = newRoom;
                        
                        state.setState({
                           ...currentState,
                           namePlayer,
                           roomId,
                           rtdbRoomId,
                        });

                        state.suscribeRtdbRoom(rtdbRoomId);
                        
                        Router.go("/newroom");
                     });
                  });

               };
            });
            }; 

      render(): void {
         this.innerHTML = `
            <img-title class="image-title"></img-title>
            
            <form class="form">
                <input-comp type="text" class="form__input-name">Tu nombre</input-comp>
                <button-comp id="button-start" class="form__button-start">Empezar</button-comp>
            </form>
            
            <move-comp></move-comp>

         `;

         this.className = "this-singup";

         const style = document.createElement("style");
         style.innerText = `

         .this-singup {
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
            display:flex;
            align-items: end;
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
      "signup-page", initSignupPage);
