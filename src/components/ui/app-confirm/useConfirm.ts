import {
  ButtonActionType,
  ButtonType,
  ConfirmInitParamsType,
  ConfirmParamsType,
  DefaultButtonType,
  DefaultButtonTypes,
  textType,
} from "@/components/ui/app-confirm/app-confirm.type";
import { ref } from "vue";
import { filterObjectValues } from "@/utils/helper";

const activeConfirm = ref<null | ConfirmInitParamsType>(null);
const openConfirmModal = ref(false);

let resolvePromise: (value?: "confirm" | "save") => void;
let rejectPromise: (reason?: "cancel") => void;

export default function() {

  const confirm = {
    defaultButtons: function(type: DefaultButtonType): ButtonType[] {
      const buttonTypes: DefaultButtonTypes = {
        cancel: [
          { label: "Отменить", status: "secondary", action: "cancel" },
          { label: "Выйти", status: "danger", action: "confirm" },
          { label: "Сохранить", status: "primary", action: "save" },
        ],
        delete: [
          { label: "Отменить", status: "secondary", action: "cancel" },
          { label: "Удалить", status: "danger", action: "confirm" },
        ],
        show: [
          { label: "Понятно", action: "confirm", status: "primary" },
        ],
      };

      return buttonTypes[type];
    },

    openModal: function(
      type: DefaultButtonType,
      title: textType,
      description: textType,
    ) {
      return this.init({
        title,
        description,
        buttons: this.defaultButtons(type),
      });
    },

    init: function(params: ConfirmInitParamsType = {}) {

      return new Promise((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;

        params = filterObjectValues(params);
        openConfirmModal.value = true;
        activeConfirm.value = params;

        // console.log(openConfirmModal.value, activeConfirm.value);
      });
    },

    cancel: function(params: ConfirmParamsType = {}) {
      return this.openModal(
        "cancel",
        params.title || "Вы уверены что хотите отменить?",
        params.description || "Все не сохраненные изменения будут потеряны",
      );
    },

    delete: function(params: ConfirmParamsType = {}) {
      return this.openModal(
        "delete",
        params.title || "Вы уверены, что хотите удалить эту запись?",
        params.description ||
        "Это действие необратимо, и запись будет полностью удалена из системы",
      );
    },

    show: function(description: textType = "Вы не можете деактивировать эту запись, так как она имеет связи с другими записями в системе. Пожалуйста, сначала удалите или измените записи, с которыми она связана.") {
      return this.openModal("show", "", description);
    },
  };

  const sendAction = (action: ButtonActionType) => {
    openConfirmModal.value = false;

    if (action === "save" || action === "confirm") {
      resolvePromise(action);
    } else if (action === "cancel") {
      rejectPromise(action);
    }
  };

  return {
    confirm,
    openConfirmModal,
    activeConfirm,
    sendAction,
  };
}