import { Router } from "@vaadin/router";
import { state } from "../../state";

   class initEnterRoom extends HTMLElement {
      connectedCallback() {
         
         this.render();
         
         const imageTitle = this.querySelector(".image-title");
         imageTitle.addEventListener("click", () => {
            Router.go("/");
         });
         // 
         const buttonEnterRoom = this.querySelector(".form__button-enter-room");
         buttonEnterRoom.addEventListener("click", (e) => {

            const currentState = state.getState();

            const roomId = document
               .querySelector(".form__input-room")
               .shadowRoot.querySelector("input").value;

            state.authRoomId(roomId).then((res) => {

               if (res.exists) {
                  state.setState({
                     ...currentState,
                     roomId,
                     rtdbRoomId: res.rtdbRoomId,
                     namePlayer: ""
                  });

                  Router.go("/login");
                  
               }
               else{
                  Router.go("/");
               }
            });
         });
      }

      render(): void {
         this.innerHTML = `
            <img-title class="image-title"></img-title>

            <div class="form">
               <input-comp type="text" class="form__input-room">Código</input-comp>
               <button-comp class="form__button-enter-room">Ingresar a la sala</button-comp>
            </div>

            <move-comp></move-comp>
         `;

         this.className = "this-enter-room";

         const style = document.createElement("style");

         style.innerText = `

         .this-enter-room {
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
            align-items:end;
         }

         .button__container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            row-gap: 3vh; 
            height: 35vh;
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
   customElements.define("enter-room-page", initEnterRoom);
