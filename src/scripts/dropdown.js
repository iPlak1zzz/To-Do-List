export class Dropdown {
  selectors = {
    root: "[data-js-todo-dropdown]",
    select: "[data-js-todo-dropdown-select]",
    selected: "[data-js-todo-dropdown-selected]",
    caret: "[data-js-todo-dropdown-caret]",
    menu: "[data-js-todo-dropdown-menu]",
    item: "[data-js-todo-dropdown-item]",
  };

  stateClasses = {
    open: "menu-open",
    rotate: "caret-rotate",
  };

  constructor(root = document, onChange) {
    this.root = root.querySelector(this.selectors.root);
    if (!this.root) return;

    this.onChange = onChange

    this.select = this.root.querySelector(this.selectors.select);
    this.selected = this.root.querySelector(this.selectors.selected);
    this.caret = this.root.querySelector(this.selectors.caret);
    this.menu = this.root.querySelector(this.selectors.menu);

    this.state = {
      open: false,
      value: this.selected?.textContent.trim() ?? "",
    };

    this.bindEvent();
    this.render();
  }

  render() {
    this.menu?.classList.toggle(this.stateClasses.open, this.state.open);
    this.caret?.classList.toggle(this.stateClasses.rotate, this.state.open);
    if (this.selected) this.selected.textContent = this.state.value;
  }

  setState(patch) {
    Object.assign(this.state, patch);
    this.render();
  }

  bindEvent() {
    this.select.addEventListener("click", () =>
      this.setState({ open: !this.state.open })
    );
    this.menu.addEventListener("click", (event) => {
      const item = event.target.closest(this.selectors.item);
      if (!item) return;
      this.setState({ value: item.textContent.trim(), open: false });
    });
    document.addEventListener("click", (event) => {
      if (!this.root.contains(event.target)) this.setState({ open: false });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.setState({ open: false });
    });
  }
}
