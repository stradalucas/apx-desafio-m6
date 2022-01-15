customElements.define(
   "button-comp",
   class ButtonComp extends HTMLElement {
      shadow: ShadowRoot;
      constructor() {
         super();
         this.shadow = this.attachShadow({ mode: "open" });
         this.render();
      }
      render() {
         const button = document.createElement("button");
         const style = document.createElement("style");
         button.className = "button-el";
         button.textContent = this.textContent;

         style.innerText = `
            .button-el {
              color: #fff;
              min-width: 300px;
              width:  calc( (60vh + 40vw) /2.25);
              text-align: center;
              background: var(--color-blue-btn);
              border-radius: 1vh;
              border: 1vh groove var(--color-blue-border);
              font-size: 4vh;
              font-family: var(--font-odibee-sans);
              cursor: pointer;
              padding: 1vh;
            }`;

         this.shadow.appendChild(button);
         this.shadow.appendChild(style);
      }
   }
);
