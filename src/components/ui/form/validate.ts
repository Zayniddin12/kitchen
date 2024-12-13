import { RulesType, ValidateRulesType } from "@/components/ui/form/form.type";
import { FormItemRule } from "element-plus";
import { Arrayable } from "element-plus/es/utils";
import { validateNumber } from "@/utils/helper";
import { useI18n } from "vue-i18n";

export const getRules = (rules: RulesType) => {
  const { required, min, max, type, trigger } = rules;

  return { required, min, max, type, trigger };
};

export const setRules = (rules: RulesType): Arrayable<FormItemRule> | ValidateRulesType[] => {
  const { t } = useI18n();

  const formRules: ValidateRulesType[] = [];
  const trigger = rules.trigger || "change";

  if (rules.required) {
    formRules.push({
      required: true,
      message: t("form.validate.required"),
      trigger,
    });
  }

  if (rules.type === "text" || rules.type === "passport") {
    if (rules.min || rules.max) {
      const lengthRule: ValidateRulesType = {
        trigger, min: rules.min, max: rules.max,
      };

      if (rules.min && rules.max && rules.min === rules.max) {
        lengthRule.message = t("form.validate.symbol.length", { length: rules.min - (rules.type === "passport" ? 1 : 0) });
      } else {
        lengthRule.message = [
          rules.min && t("form.validate.symbol.min", { length: rules.min }),
          rules.max && t("form.validate.symbol.max", { length: rules.max }),
        ]
          .filter(Boolean)
          .join(` ${t("common.and")} `);
      }

      formRules.push(lengthRule);
    }
  } else if (rules.type === "email") {
    formRules.push({
      type: "email",
      message: t("form.validate.email"),
      trigger,
    });
  } else if (rules.type === "number") {
    formRules.push({
      type: "number",
      validator: (rule: any, value: any, callback: any) => {
        console.log(rules);
        if (!value) return callback();
        else {
          const newValue = validateNumber(value);

          if (isNaN(newValue)) {
            return callback(new Error(t("form.validate.number.incorrect")));
          } else if (rules.min && rules.max && rules.min === rules.max && newValue !== rules.max) {
            return callback(new Error(t("form.validate.number.length", { length: rules.min })));
          } else if (rules.min && newValue < rules.min) {
            return callback(new Error(t("form.validate.number.min", { length: rules.min })));
          } else if (rules.max && newValue > rules.max) {
            return callback(new Error(t("form.validate.number.max", { length: rules.max })));
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
