import { Todo } from './todo.js'

export class Modal {
  selestors = {
    openModalButton: "[data-js-open-modal-button]",
    newTaskForm: '[data-js-todo-new-task-form]',
    newTaskInput: '[data-js-todo-new-task-input]',
    newTaskFormFirstRule: '[data-js-first-rule]',
    newTaskFormSecondRule: '[data-js-second-rule]',
    newTaskFormThirdRule: '[data-js-third-rule]',
    closeModalCancelButton: "[data-js-close-cancel-button]",
    closeModalAcceptButton: "[data-js-close-accept-button]",
    modalOverlay: "[data-js-modal-overlay]",
    modal: "[data-js-modal]",
  };

  stateClasses = {
    isOpen: "is-open",
  };

  constructor() {
    this.openModalButtonElement = document.querySelector(
      this.selestors.openModalButton
    );

    this.modalOverlayElement = document.querySelector(
      this.selestors.modalOverlay
    );
    this.modalElement = document.querySelector(this.selestors.modal);

    this.newTaskFormElement = this.modalElement.querySelector(this.selestors.newTaskForm)
    this.newTaskInputElement = this.modalElement.querySelector(this.selestors.newTaskInput)

    this.newTaskFormFirstRuleElement = this.modalElement.querySelector(this.selestors.newTaskFormFirstRule)
    this.newTaskFormSecondRuleElement = this.modalElement.querySelector(this.selestors.newTaskFormSecondRule)
    this.newTaskFormThirdRuleElement = this.modalElement.querySelector(this.selestors.newTaskFormThirdRule)

    this.closeModalCancelButton = this.modalElement.querySelector(
      this.selestors.closeModalCancelButton
    );
    this.closeModalAccceptButtonElement = this.modalElement.querySelector(this.selestors.closeModalAcceptButton)
    this.bindEvents();
  }

  actionModal = () => {
    this.modalOverlayElement.classList.toggle(this.stateClasses.isOpen);
    this.modalElement.classList.toggle(this.stateClasses.isOpen);
  };

  bindEvents() {
    this.openModalButtonElement.addEventListener("click", this.actionModal);
    this.closeModalCancelButton.addEventListener("click", this.actionModal);
  }
}