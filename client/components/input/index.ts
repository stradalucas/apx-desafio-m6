customElements.define(
   "input-comp",
   class InputComp extends HTMLElement {
      shadow: ShadowRoot;
      constructor() {
         super();
         this.shadow = this.attachShadow({ mode: "open" });
         this.render();
      }
      render() {
         const input = document.createElement("input");
         const style = document.createElement("style");
         const texto = this.textContent;
         input.className = "input-el";
         input.placeholder = this.textContent;

         style.innerText = `
            .input-el {
               min-width: 300px;
               width:  calc( (60vh + 40vw) /2.25);
               text-align: center;
               color: #000;
               border-radius: 1vh;
               border: 1vh groove var(--color-blue-border);
               font-size: 4vh;
               font-family: var(--font-odibee-sans);
               cursor: pointer;
               padding: 1vh;
               box-sizing: border-box;
            }`;

         input.textContent = this.textContent;
         this.shadow.appendChild(input);
         this.shadow.appendChild(style);
      }
   }
);
