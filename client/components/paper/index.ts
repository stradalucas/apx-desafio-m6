const papel = require("url:../../assets/papel.svg");

customElements.define(
   "hand-paper",
   class PaperComp extends HTMLElement {
      shadow: ShadowRoot;
      constructor() {
         super();
         this.shadow = this.attachShadow({ mode: "open" });
         this.render();
      }
      render() {
         const style = document.createElement("style");
         this.shadow.innerHTML = `
                <img class="hand-paper" src="${papel}"/>
            `;

         style.innerText = `
            .hand-paper {
               height: 27vh;
               cursor: pointer;
            }`;

         this.shadow.appendChild(style);
      }
   }
);
