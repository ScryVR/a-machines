// @ts-ignore
import { registerMafiuComponent } from 'mafiu/dist/generator'
// @ts-ignore
import { getParsedTemplate } from 'mafiu/dist/getParsedTemplate'


const name = "scrolling-selector"

function generateSelectOptions(options: Array<string>, selected: string) {
  return /*html*/`
  <div class="empty-spacer"></div>
  ${options.map(a => `<button class="${a === selected ? "selected-option" : "not-selected"} noselect" data-option="${a}">${a}</button>`).join("")}
  <div class="empty-spacer"></div>
  `
}

const template = /*html*/`
<style>
  .scroll-up-indicator {
    content: "";
    position: absolute;
    top: 30px;
    left: calc(50% - 5px);
    border: 2px solid transparent;
    border-left-color: cyan;
    border-bottom-color: cyan;
    width: 10px;
    height: 10px;
    box-sizing: border-box;
    transform: rotate(135deg);
  }
  .scroll-down-indicator {
    content: "";
    position: absolute;
    bottom: 30px;
    left: calc(50% - 5px);
    border: 2px solid transparent;
    border-left-color: cyan;
    border-bottom-color: cyan;
    width: 10px;
    height: 10px;
    box-sizing: border-box;
    transform: rotate(-45deg);
  }
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
    position: relative;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .empty-spacer {
    min-height: 40px;
    width: 100%;
  }
</style>
<div style="position: relative;">
  <div class="{{scrollUpIndicatorClass}}"></div>
    <div
      class="scrolling-selector"
      mhandle="onScroll:scroll"
    >
    </div>
  <div class="{{scrollDownIndicatorClass}}"></div>
</div>
`

registerMafiuComponent({
  name,
  template,
  data: {
    options: "",
    scrollUpIndicatorClass: "",
    scrollDownIndicatorClass: "",
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
      const optionsList = options.split(",")
      this.querySelector(".scrolling-selector").innerHTML = getParsedTemplate(generateSelectOptions(optionsList, optionsList[0]))
      this.querySelector(".scrolling-selector").scrollTop = 0
      this.state.selectedBtn = this.querySelector("button")
      this.state.selectedOption = optionsList
      if (optionsList.length > 1) {
        this.state.scrollDownIndicatorClass = "scroll-down-indicator"
      }
      this.state.scrollUpIndicatorClass = ""
    }]
  },
  handlers: {
    onScroll(event: any) {
      // Hide scroll indicators to reduce visual noise
      this.state.scrollDownIndicatorClass = ""
      this.state.scrollUpIndicatorClass = ""

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
        // Set scroll indicators
        if (buttonIndex > 0) {
          this.state.scrollUpIndicatorClass = "scroll-up-indicator"
        } else {
          this.state.scrollUpIndicatorClass = ""
        }
        if (buttonIndex < buttons.length - 1) {
          this.state.scrollDownIndicatorClass = "scroll-down-indicator"
        } else {
          this.state.scrollDownIndicatorClass = ""
        }
      }, 300)
    }
  }
})