import { RulesType, ValidateRulesType } from "@/components/ui/form/form.type";
import { FormItemRule } from "element-plus";
import { Arrayable } from "element-plus/es/utils";

export const getRules = (rules: RulesType) => {
    const { required, min, max, type, trigger } = rules;

    return {
        ...(required && { required }),
        ...(min && { min }),
        ...(max && { max }),
        ...(type && { type }),
        ...(trigger && { trigger })
    };
};

export const setRules = (rules: RulesType): Arrayable<FormItemRule> | ValidateRulesType[] | any => {
    const formRules: ValidateRulesType[] = [];

    const trigger = rules.trigger || "change";

    if (rules.required) {
        formRules.push({
            required: true,
            message: "Обязательное поле",
            trigger
        });
    }

    if (rules.min || rules.max) {
        const rule: ValidateRulesType = { trigger };

        if (rules.min && rules.max) {
            rule.min = rules.min;
            rule.max = rules.max;
            if (rule.min === rule.max) {
                rule.message = `Длина должна быть ${rule.min} символов`;
            } else {
                rule.message = `Длина символов должна быть в пределах от ${rules.min} до ${rules.max}`;
            }
        } else if (rules.min) {
            rule.min = rules.min;
            rule.message = `Должно быть не менее ${rules.min} символов`;
        } else if (rules.max) {
            rule.max = rules.max;
            rule.message = `Должно быть не более ${rules.max} символов`;
        }

        formRules.push(rule);
    }

    switch (rules.type) {
        case "email":
            formRules.push({
                type: "email",
                message: "Неправильный email",
                trigger
            });
    }

    return formRules;
};
