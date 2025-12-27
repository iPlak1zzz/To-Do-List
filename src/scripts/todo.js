import { Dropdown } from "./dropdown.js";
import { Modal } from "./modal.js";

export class Todo {
  selectors = {
    /* 1 */
    root: "[todo-data-js]",
    searchTaskForm: "[data-js-todo-search-form]",
    searchTaskInput: "[data-js-todo-search-task-input]",
    list: "[data-js-todo-list]",
    item: "[data-js-todo-item]",
    itemCheckbox: "[data-js-todo-item-checkbox]",
    itemLabel: "[data-js-todo-item-label]",
    itemRenamButton: "[data-js-todo-item-rename-button]",
    itemDeleteButton: "[data-js-todo-item-delete-button]",
    emptyMessage: "[data-js-todo-empty-message]",
  };

  stateClasses = {
    /* 2 */
    isVisible: "is-visible",
    isDisappearing: "is-disappearing",
    isInvalid: "is-invalid",
    showSelectElement: "show-select",
    hideSelectElement: "hide-select",
  };

  localStorageKey = "todo-items";
  /* 3 */

  constructor() {
    /* 4 */
    this.rootElement = document.querySelector(this.selectors.root);
    this.searchTaskFormElement = this.rootElement.querySelector(
      this.selectors.searchTaskForm
    );
    this.searchTaskInputElement = this.rootElement.querySelector(
      this.selectors.searchTaskInput
    );
    this.listElement = this.rootElement.querySelector(this.selectors.list);
    this.emptyMessageElement = this.rootElement.querySelector(
      this.selectors.emptyMessage
    );

    this.state = {
      /* 5 */
      items: this.getItemFromLocalStorage(),
      filteredItems: null,
      searchQuery: "",
      editingItemId: null,
    };

    this.modal = new Modal();
    this.dropdown = new Dropdown(this.rootElement, (value) => {
      this.generalFilter(value);
    });
    this.render();
    this.bindEvents();
  }

  getItemFromLocalStorage() {
    /* 6 */
    const rawData = localStorage.getItem(this.localStorageKey);

    if (!rawData) {
      return [];
    }

    try {
      const parsedData = JSON.parse(rawData);
      return Array.isArray(parsedData) ? parsedData : [];
    } catch {
      console.error("Todo items parse error");
      return [];
    }
  }

  saveItemsToLocalStorage() {
    /* 7 */
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.state.items)
    );
  }

  render() {
    /* 8 */
    const items = this.state.filteredItems ?? this.state.items;

    this.listElement.innerHTML = items
      .map(
        ({ id, title, isChecked }) => `
            <li class="todo__item todo-item" data-js-todo-item>
          <input
          class="todo-item__checkbox"
          id="${id}"
          type="checkbox"
          ${isChecked ? "checked" : ""}
          data-js-todo-item-checkbox
          />
          <label for="${id}" class="todo-item__label" data-js-todo-item-label
            >
             ${title}
          </label>
          <div class="todo-item__buttons buttons">
            <button
              class="buttons__rename-button"
              aria-label="Rename"
              title="Rename"
              type="button"
              data-js-todo-item-rename-button
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.17272 3.49106L0.5 10.1637V13.5H3.83636L10.5091 6.82736M7.17272 3.49106L9.5654 1.09837L9.5669 1.09695C9.8962 0.767585 10.0612 0.602613 10.2514 0.540824C10.4189 0.486392 10.5993 0.486392 10.7669 0.540824C10.9569 0.602571 11.1217 0.767352 11.4506 1.09625L12.9018 2.54738C13.2321 2.87769 13.3973 3.04292 13.4592 3.23337C13.5136 3.40088 13.5136 3.58133 13.4592 3.74885C13.3974 3.93916 13.2324 4.10414 12.9025 4.43398L12.9018 4.43468L10.5091 6.82736M7.17272 3.49106L10.5091 6.82736"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              class="buttons__delete-button"
              type="button"
              aria-label="Delete"
              title="Delete"
              data-js-todo-item-delete-button
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.87414 7.61505C3.80712 6.74386 4.49595 6 5.36971 6H12.63C13.5039 6 14.1927 6.74385 14.1257 7.61505L13.6064 14.365C13.5463 15.1465 12.8946 15.75 12.1108 15.75H5.88894C5.10514 15.75 4.45348 15.1465 4.39336 14.365L3.87414 7.61505Z"
                  stroke="white"
                />
                <path
                  d="M14.625 3.75H3.375"
                  stroke="white"
                  stroke-linecap="round"
                />
                <path
                  d="M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z"
                  stroke="white"
                />
                <path d="M10.5 9V12.75" stroke="white" stroke-linecap="round" />
                <path d="M7.5 9V12.75" stroke="white" stroke-linecap="round" />
              </svg>
            </button>
          </div>
        </li>
        `
      )
      .join("");

    const isEmptyFilteredItems = this.state.filteredItems?.length === 0;
    const isEmptyItems = this.state.items.length === 0;

    this.emptyMessageElement.textContent = isEmptyFilteredItems
      ? "Tasks not found"
      : "";

    // this.emptyMessageElement.innerHTML = isEmptyItems
    //   ? `<img src="/src/images/emptyMainImage.png" alt="Empty..." class="todo__empty-message__img">
    //   <p class="todo__empty-message__text">Empty...</p>`
    //   : "";

    this.emptyMessageElement.innerHTML = "";

    if (isEmptyItems) {
      this.emptyMessageElement.innerHTML = `
        <img src="/src/images/emptyMainImage.png" alt="Empty..." class="todo__empty-message__img">
        <p class="todo__empty-message__text">Empty...</p>
      `;
    } else if (isEmptyFilteredItems) {
      this.emptyMessageElement.innerHTML = `
        <img src="/src/images/emptyMainImage.png" alt="Empty..." class="todo__empty-message__img">
        <p class="todo__empty-message__text">Empty...</p>
      `;
    }
  }

  addItem(title) {
    /* 8 */
    try {
      this.state.items.push({
        id: crypto?.randomUUID() ?? Date.now().toString(),
        title,
        isChecked: false,
      });
    } catch (error) {
      console.error(error);
    }
    this.dropdown.setState({ value: "All" });

    this.resetFilter();

    this.dropdown.setState({ value: "All" });
    this.dropdown.selected.textContent = "All";

    this.render();
    this.saveItemsToLocalStorage();
  }

  deleteItem(id) {
    this.state.items = this.state.items.filter((item) => {
      return item.id !== id;
    });

    if (this.state.filteredItems !== null) {
      const option = this.dropdown.state.value?.toLocaleLowerCase();
      this.generalFilter(option);
    }

    this.render();
    this.saveItemsToLocalStorage();
  }

  renameItem(id, newTitle) {
    this.state.items = this.state.items.map((item) =>
      item.id === id ? { ...item, title: newTitle } : item
    );

    this.saveItemsToLocalStorage();
    this.render();
  }
  openRenameModal(id) {
    if (!confirm("Are you sure?")) return;

    const item = this.state.items.find((item) => item.id === id);
    if (!item) return;

    this.state.editingItemId = id;
    this.modal.newTaskInputElement.value = item.title;

    this.resetRulesToCreateTask();
    this.modal.actionModal();
  }

  toggleCheckedState(id) {
    this.state.items = this.state.items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          isChecked: !item.isChecked,
        };
      }
      return item;
    });

    if (this.state.filteredItems !== null) {
      const option = this.dropdown.state.value?.toLocaleLowerCase();
      this.generalFilter(option);
    }

    this.saveItemsToLocalStorage();
    this.render();
  }

  filter() {
    const queryFormatted = this.state.searchQuery.toLowerCase();

    this.state.filteredItems = this.state.items.filter(({ title }) => {
      const titleFormatted = title.toLowerCase();

      return titleFormatted.includes(queryFormatted);
    });

    this.render();
  }

  generalFilter(option) {
    const value = option.toLowerCase();
    if (value === "all") {
      this.state.filteredItems = null;
    } else {
      this.state.filteredItems = this.state.items.filter((item) => {
        console.log(this.state.filteredItems);
        return value === "complete"
          ? item.isChecked
          : value === "incomplete"
          ? !item.isChecked
          : true;
      });
    }

    this.render();
  }

  generalFilter(option) {
    let result = this.state.items;

    const value = option.toLowerCase();

    result = result.filter((item) => {
      console.log(this.state.filteredItems);
      return value === "complete"
        ? item.isChecked
        : value === "incomplete"
        ? !item.isChecked
        : true;
    });

    if (this.state.searchQuery !== "") {
      const queryFormatted = this.state.searchQuery.toLowerCase();

      result = result.filter(({ title }) => {
        const titleFormatted = title.toLowerCase();

        return titleFormatted.includes(queryFormatted);
      });
    }

    this.state.filteredItems = result;
    this.render();
  }

  resetFilter() {
    this.state.filteredItems = null;
    this.state.searchQuery = "";
    this.render();
  }

  resetRulesToCreateTask() {
    this.modal.newTaskFormFirstRuleElement.classList.remove(
      this.stateClasses.isInvalid
    );
    this.modal.newTaskFormSecondRuleElement.classList.remove(
      this.stateClasses.isInvalid
    );
    this.modal.newTaskFormThirdRuleElement.classList.remove(
      this.stateClasses.isInvalid
    );
  }

  checkNewTaskFormRules(input) {
    const modalInputValue = input;

    if (modalInputValue.trim().length === 0) {
      this.resetRulesToCreateTask();
      return false;
    }

    let allRulesTrue = true;

    const notEmpty = () => {
      const resultRule = modalInputValue.trim().length > 0;
      if (!resultRule) {
        this.modal.newTaskFormThirdRuleElement.classList.add(
          this.stateClasses.isInvalid
        );
        allRulesTrue = false;
      }
    };

    const doesNotStartWithASpace = () => {
      const resultRule = !modalInputValue.startsWith(" ");
      if (!resultRule) {
        this.modal.newTaskFormSecondRuleElement.classList.add(
          this.stateClasses.isInvalid
        );
        allRulesTrue = false;
      }
    };

    const notShortenThanThreeSumbols = () => {
      const resultRule = modalInputValue.trim().length > 3;
      if (!resultRule) {
        this.modal.newTaskFormFirstRuleElement.classList.add(
          this.stateClasses.isInvalid
        );
        allRulesTrue = false;
      }
    };

    this.resetRulesToCreateTask();

    notEmpty();
    doesNotStartWithASpace();
    notShortenThanThreeSumbols();
    return allRulesTrue;
  }

  onNewTaskFormSubmit = (event) => {
    event.preventDefault();

    const newTodoItemTitle = this.modal.newTaskInputElement.value;

    if (!this.checkNewTaskFormRules(newTodoItemTitle)) return;

    if (this.state.editingItemId !== null) {
      this.renameItem(this.state.editingItemId, newTodoItemTitle);
      this.state.editingItemId = null;
    } else {
      this.addItem(newTodoItemTitle);
    }

    this.modal.newTaskInputElement.value = "";
    this.resetRulesToCreateTask();
    this.modal.actionModal();
  };

  onSearchTaskFormSubmit = (event) => {
    event.preventDefault();
  };

  onSearchTaskInputChange = ({ target }) => {
    const value = target.value.trim();
    if (value.length > 0) {
      this.state.searchQuery = value;
      this.generalFilter(this.dropdown.state.value || "All");
    } else {
      this.state.searchQuery = ""
      this.generalFilter(this.dropdown.state.value || 'All')
    }
  };

  onClick = ({ target }) => {
    if (target.closest(this.selectors.itemRenamButton)) {
      const itemElement = target.closest(this.selectors.item);
      const itemCheckboxElement = itemElement.querySelector(
        this.selectors.itemCheckbox
      );

      this.openRenameModal(itemCheckboxElement.id);
      return;
    }

    if (target.closest(this.selectors.itemDeleteButton)) {
      const itemElement = target.closest(this.selectors.item);
      const itemCheckboxElement = itemElement.querySelector(
        this.selectors.itemCheckbox
      );
      itemElement.classList.add(this.stateClasses.isDisappearing);

      setTimeout(() => {
        this.deleteItem(itemCheckboxElement.id);
      }, 400);
    }
  };

  onChange = ({ target }) => {
    if (target.matches(this.selectors.itemCheckbox)) {
      this.toggleCheckedState(target.id);
    }
  };

  bindEvents() {
    this.modal.newTaskFormElement.addEventListener(
      "submit",
      this.onNewTaskFormSubmit
    );
    this.modal.closeModalAccceptButtonElement.addEventListener(
      "click",
      this.onNewTaskFormSubmit
    );
    this.searchTaskFormElement.addEventListener(
      "submit",
      this.onSearchTaskFormSubmit
    );
    this.searchTaskInputElement.addEventListener(
      "input",
      this.onSearchTaskInputChange
    );
    this.listElement.addEventListener("click", this.onClick);
    this.listElement.addEventListener("change", this.onChange);

    this.dropdown.menu.addEventListener("click", () => {
      this.generalFilter(this.dropdown.state.value.toLowerCase());
    });
  }
}
