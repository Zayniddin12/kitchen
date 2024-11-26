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
                rule.message = `Must be ${rule.min} characters long`;
            } else {
                rule.message = `Characters length should be between ${rules.min} and ${rules.max}`;
            }
        } else if (rules.min) {
            rule.min = rules.min;
            rule.message = `Must be at least ${rules.min} characters`;
        } else if (rules.max) {
            rule.max = rules.max;
            rule.message = `Must be at most ${rules.max} characters`;
        }

        formRules.push(rule);
    }

    switch (rules.type) {
        case "email":
            formRules.push({
                type: "email",
                message: "Invalid email",
                trigger
            });
    }

    return formRules;
};
