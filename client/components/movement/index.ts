const movement :any = {
  paper : require("url:../../assets/papel.svg"),
  stone : require("url:../../assets/piedra.svg"),
  scissor : require("url:../../assets/tijera.svg")
}
    class MoveComp extends HTMLElement {
      shadow: ShadowRoot;
      constructor() {
         super();
         this.shadow = this.attachShadow({ mode: "open" });
         this.render();
      }

      render() {
        
        this.shadow.innerHTML = `
        <img class="image-movement" src="${movement.scissor}">
        <img class="image-movement" src=${movement.stone}>
        <img class="image-movement" src=${movement.paper}>
        `;

        this.className = "movement"

        const style = document.createElement("style");

        style.innerHTML = `

        .image-movement {
          height: 27vh;
          cursor: pointer;
          margin: 0 1.5vw -3vh 1.5vw
        }
        
        image-movement:hover, image-movement:active, image-movement:focus{
            transform: translateY(1vh);
            transition: .5s;
         }

         `;
         this.shadow.appendChild(style);

    }
  }

  customElements.define("move-comp", MoveComp);
