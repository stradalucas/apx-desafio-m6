const tijera = require("url:../../assets/tijera.svg");

customElements.define(
   "hand-scissor",
   class ScissorComp extends HTMLElement {
      shadow: ShadowRoot;
      constructor() {
         super();
         this.shadow = this.attachShadow({ mode: "open" });
         this.render();
      }
      render() {
         const style = document.createElement("style");
         this.shadow.innerHTML = `
            <img class="hand-scissor" src="${tijera}">
        `;

         style.innerText = `
            .hand-scissor {
               height: 27vh;
               cursor: pointer;
            }
        `;
         this.shadow.appendChild(style);
      }
   }
);
