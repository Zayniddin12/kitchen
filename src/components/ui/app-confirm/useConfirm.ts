import {
  ButtonActionType,
  ConfirmInitParamsType,
  ConfirmParamsType,
  DefaultButtonType,
  DefaultButtonTypes, DisabledBtnType,
  textType,
} from "@/components/ui/app-confirm/app-confirm.type";
import { ref } from "vue";
import { filterObjectValues, togglePageScrolling } from "@/utils/helper";
import { ButtonType } from "element-plus";
import { useI18n } from "vue-i18n";

const activeConfirm = ref<null | ConfirmInitParamsType>(null);
const openConfirmModal = ref(false);

let resolvePromise: (value?: "confirm" | "save") => void;
let rejectPromise: (reason?: "cancel") => void;

export default function() {
  const { t } = useI18n();

  const defaultButtons: DefaultButtonTypes = {
    cancel: [
      { label: t("method.cancel"), status: "secondary", action: "cancel" },
      { label: t("method.logout"), status: "danger", action: "confirm" },
      { label: t("method.save"), status: "primary", action: "save" },
    ],
    delete: [
      { label: t("method.cancel"), status: "secondary", action: "cancel" },
      { label: t("method.delete"), status: "danger", action: "confirm" },
    ],
    confirm: [
      { label: t("method.cancel"), status: "secondary", action: "cancel" },
      { label: t("method.apply"), status: "primary", action: "confirm" },
    ],
    show: [{ label: t("method.understandable"), action: "confirm", status: "primary" }],
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
    disabledBtn?: DisabledBtnType,
  ) => {
    let buttons = defaultButtons[type];
    if (disabledBtn && buttons) {
      buttons = buttons.filter(button => button.action !== disabledBtn);
    }

    return init({
      type,
      title,
      description,
      buttons: buttons,
      disabledBody,
    });
  };

  const confirm = {
    openModal,
    confirm: (params: ConfirmParamsType = {}) =>
      openModal(
        "confirm",
        params.title || ``,
        params.description || '',
        !!params.disabledBody,
      ),
    cancel: (params: ConfirmParamsType = {}) =>
      openModal(
        "cancel",
        params.title || `<div class="max-w-[279px]">${t("confirm.cancel.title")}?</div>`,
        params.description || t("confirm.cancel.description"),
        !!params.disabledBody,
        params.disabledBtn || "",
      ),
    delete: (params: ConfirmParamsType = {}) =>
      openModal(
        "delete",
        params.title || `<div class="max-w-[360px]">${t("confirm.delete.title")}?</div>`,
        params.description || t("confirm.delete.description"),
        !!params.disabledBody,
      ),
    show: (
      description: textType = t("confirm.show.description"),
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
    init,
  };
}
