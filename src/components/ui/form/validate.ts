import { RulesType, ValidateRulesType } from "@/components/ui/form/form.type";
import { FormItemRule } from "element-plus";
import { Arrayable } from "element-plus/es/utils";
import { validateNumber } from "@/utils/helper";

export const getRules = (rules: RulesType) => {
  const { required, min, max, type, trigger } = rules;

  return { required, min, max, type, trigger };
};

export const setRules = (rules: RulesType): Arrayable<FormItemRule> | ValidateRulesType[] => {
  const formRules: ValidateRulesType[] = [];
  const trigger = rules.trigger || "change";

  if (rules.required) {
    formRules.push({
      required: true,
      message: "Обязательное поле",
      trigger,
    });
  }

  if (rules.type === "text" || rules.type === "passport") {
    if (rules.min || rules.max) {
      const lengthRule: ValidateRulesType = {
        trigger, min: rules.min, max: rules.max,
      };

      if (rules.min && rules.max && rules.min === rules.max) {
        lengthRule.message = `Длина должна быть ${rules.min - (rules.type === "passport" ? 1 : 0)} символов`;
      } else {
        lengthRule.message = [
          rules.min && `не менее ${rules.min} символов`,
          rules.max && `не более ${rules.max} символов`,
        ]
          .filter(Boolean)
          .join(" и ");
      }

      formRules.push(lengthRule);
    }
  } else if (rules.type === "email") {
    formRules.push({
      type: "email",
      message: "Неправильный email",
      trigger,
    });
  } else if (rules.type === "number") {
    formRules.push({
      type: "number",
      validator: (rule: any, value: any, callback: any) => {
        if (!value) return callback();
        else {
          const newValue = validateNumber(value);

          if (isNaN(newValue)) {
            return callback(new Error("Неверный номер"));
          } else if (rules.min && rules.max && rules.min === rules.max && newValue !== rules.max) {
            return callback(new Error(`Число должно быть равно ${rules.max}`));
          } else if (rules.min && newValue < rules.min) {
            return callback(new Error(`Число не должно быть меньше ${rules.min}`));
          } else if (rules.max && newValue > rules.max) {
            return callback(new Error(`Число не должно быть больше ${rules.max}`));
          } else {
            return callback();
          }
        }
      },
      trigger,
    });
  }

  return formRules;
};
