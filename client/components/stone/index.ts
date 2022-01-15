const piedra = require("url:../../assets/piedra.svg");

customElements.define(
   "hand-stone",
   class StoneComp extends HTMLElement {
      shadow: ShadowRoot;
      constructor() {
         super();
         this.shadow = this.attachShadow({ mode: "open" });
         this.render();
      }
      render() {
         const style = document.createElement("style");
         this.shadow.innerHTML = `
            <img class="hand-stone" src="${piedra}">
        `;

         style.innerText = `
            .hand-stone {
               height: 27vh;
               cursor: pointer;
            }
        `;

         this.shadow.appendChild(style);
      }
   }
);
