// @ts-ignore
import { registerMafiuComponent } from 'mafiu/dist/generator'
// @ts-ignore
import { getParsedTemplate } from 'mafiu/dist/getParsedTemplate'


const name = "scrolling-selector"

function generateSelectOptions(options: Array<string>, selected: string) {
  return /*html*/`
  <div class="empty-spacer"></div>
  ${options.map(a => `<button class="${a === selected ? "selected-option" : "not-selected"}" data-option="${a}">${a}</button>`).join("")}
  <div class="empty-spacer"></div>
  `
}

const scrollIndicator = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='260 320 500 500'%3E%3Cg%3E%3Cpath d='m261.44 326.65 112.86 112.86 112.86-112.86-14.113-14.113-98.742 98.742-98.742-98.742z'/%3E%3C/g%3E%3C/svg%3E"

const template = /*html*/`
<style>
  .scrolling-selector .selected-option {
    color: #0dd !important;
  }
  .scrolling-selector button {
    height: 40px;
    font-size: 16px;
    flex-shrink: 0;
    background: none;
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    color: transparent;
    transition: color 0.3s;
  }
  .scrolling-selector.active button {
    color: rgba(0,0,0,0.5);
  }
  .scrolling-selector {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    max-height: 120px;
    overflow: auto;
    pointer-events: auto;
    scrollbar-width: none;  /* Firefox */
    scroll-behavior: smooth;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .empty-spacer {
    min-height: 40px;
    width: 100%;
  }
</style>
<div
  class="scrolling-selector"
  mhandle="onScroll:scroll"
>
</div>
`

registerMafiuComponent({
  name,
  template,
  data: {
    options: ""
  },
  hooks: {
    selectedOption: [function(newSelection: string, oldSelection: string) {
      if (newSelection !== oldSelection) {
        this.dispatchEvent(new CustomEvent("select", { detail: { selection: newSelection } }))
      }
    }],
    selectedBtn: [function (newVal: HTMLButtonElement) {
      this.querySelector(".selected-option").classList.remove("selected-option")
      newVal?.classList.add("selected-option")
    }],
    options: [function (options: string, oldOptions: string) {
      this.querySelector(".scrolling-selector").innerHTML = getParsedTemplate(generateSelectOptions(options.split(","), options.split(",")[0]))
      this.querySelector(".scrolling-selector").scrollTop = 0
      this.state.selectedBtn = this.querySelector("button")
      this.state.selectedOption = options.split(",")[0]
    }]
  },
  handlers: {
    onScroll(event: any) {
      // Update selected action
      const buttons: Array<HTMLButtonElement> = Array.from(event.target.querySelectorAll("button"))
      const buttonIndex = Math.round(event.target.scrollTop / 40)
      this.state.selectedBtn = buttons[buttonIndex]
      this.state.selectedOption = this.state.selectedBtn.getAttribute("data-option")

      // UI stuff
      event.target.classList.add("active")
      clearTimeout(this.state.setInactiveTimeout)
      this.state.setInactiveTimeout = setTimeout(() => {
        event.target.classList.remove("active")
        event.target.scrollTop = Math.round(event.target.scrollTop / 40) * 40
      }, 300)
    }
  }
})