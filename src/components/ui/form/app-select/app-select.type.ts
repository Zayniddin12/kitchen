import { Placement } from "element-plus";
import { ElFormItemType } from "@/components/ui/form/form.type";

export type AppSelectValueType = string | number | boolean | Record<string, any> | any[];

export interface AppSelectPropsType extends ElFormItemType {
    multiple?: boolean,
    multipleLimit?: number,
    collapseTags?: boolean,
    collapseTagsTooltip?: boolean,
    maxCollapseTags?: number,
    loading?: boolean,
    loadingText?: string,
    items?: any[],
    itemValue?: string,
    itemLabel?: string,
    itemDisabled?: boolean,
    filterable?: boolean,
    noMatchText?: string,
    noDataText?: string,
    popperClass?: string,
    defaultFirstOption?: boolean,
    teleported?: boolean,
    persistent?: boolean,
    automaticDropdown?: boolean,
    placement?: Placement,
    remoteMethod?: () => void,
    remote?: boolean,
    remoteShowSuffix?: boolean
}