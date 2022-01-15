import { Router } from "@vaadin/router";
const imgTitle = require("url:../../assets/imgWelcome.svg");


customElements.define(
   "img-title",
   class TitleComp extends HTMLElement {
      shadow: ShadowRoot;
      constructor() {
         super();
         this.shadow = this.attachShadow({ mode: "open" });
         this.render();
      }
      render() {
         const style = document.createElement("style");
         this.shadow.innerHTML = `
            <img class="img-title" src="${imgTitle}">
         `;

         style.innerText = `
            .img-title {
                height: 30vh;
            }
            .img-title:hover {
                cursor:pointer;
            }
            `;
         this.shadow.appendChild(style);
      }
   }
);
