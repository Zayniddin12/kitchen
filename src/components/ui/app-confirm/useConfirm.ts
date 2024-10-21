import {
  ButtonActionType,
  ConfirmInitParamsType,
  ConfirmParamsType,
  DefaultButtonType,
  DefaultButtonTypes,
  textType,
} from "@/components/ui/app-confirm/app-confirm.type";
import { ref } from "vue";
import { filterObjectValues, togglePageScrolling } from "@/utils/helper";

const activeConfirm = ref<null | ConfirmInitParamsType>(null);
const openConfirmModal = ref(false);

let resolvePromise: (value?: "confirm" | "save") => void;
let rejectPromise: (reason?: "cancel") => void;

export default function() {
  const defaultButtons: DefaultButtonTypes = {
    cancel: [
      { label: "Отменить", status: "secondary", action: "cancel" },
      { label: "Выйти", status: "danger", action: "confirm" },
      { label: "Сохранить", status: "primary", action: "save" },
    ],
    delete: [
      { label: "Отменить", status: "secondary", action: "cancel" },
      { label: "Удалить", status: "danger", action: "confirm" },
    ],
    show: [{ label: "Понятно", action: "confirm", status: "primary" }],
  };

  const init = (params: ConfirmInitParamsType = {}) =>
    new Promise((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;

      activeConfirm.value = filterObjectValues(params);

      openConfirmModal.value = true;
    });

  const openModal = (
    type: DefaultButtonType,
    title: textType,
    description: textType,
    disabledBody = false,
  ) =>
    init({
      title,
      description,
      buttons: defaultButtons[type],
      disabledBody,
    });

  const confirm = {
    openModal,
    cancel: (params: ConfirmParamsType = {}) =>
      openModal(
        "cancel",
        params.title || "<div>Вы уверены что хотите отменить?</div>",
        params.description || "Все не сохраненные изменения будут потеряны",
        !!params.disabledBody,
      ),
    delete: (params: ConfirmParamsType = {}) =>
      openModal(
        "delete",
        params.title || "<div class='max-w-[360px]'>Вы уверены, что хотите удалить эту запись?</div>",
        params.description ||
        "Это действие необратимо, и запись будет полностью удалена из системы",
        !!params.disabledBody,
      ),
    show: (
      description: textType = "Вы не можете деактивировать эту запись, так как она имеет связи с другими записями в системе. Пожалуйста, сначала удалите или измените записи, с которыми она связана.",
      disabledBody = false,
    ) => openModal("show", "", description, disabledBody),
  };

  const sendAction = (action: ButtonActionType) => {
    const successAction = action === "save" || action === "confirm";
    openConfirmModal.value = false;
    if (activeConfirm.value?.disabledBody) togglePageScrolling(!successAction);

    successAction
      ? resolvePromise(action)
      : rejectPromise(action);
  };

  return {
    confirm,
    openConfirmModal,
    activeConfirm,
    sendAction,
  };
}
