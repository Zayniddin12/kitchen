import { StatusTextType, StatusType } from "@/types/common.type";
import { LocationQuery } from "vue-router";

export const formatDate = (date: Date) => {
  const daysOfWeek = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dayOfWeek = daysOfWeek[date.getDay()];

  return {
    date: `${day}.${month}.${year}`,
    week: dayOfWeek,
  };
};

export const formatNumber = (value: number, format = " ") => {
  if (!value) return 0;
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `${format}`);
};

export const phoneFormatter = (phoneNumberString: string) => {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(998|)?(\d{2})(\d{3})(\d{2})(\d{2})$/);

  if (match) {
    const intlCode = match[1] ? "+998 " : "";
    return [
      intlCode,
      "(",
      match[2],
      ") ",
      match[3],
      "-",
      match[4],
      "-",
      match[5],
    ].join("");
  }

  return null;
};

export const formatPhone = (phone?: string): string => {
  if (phone && phone.startsWith("998") && phone.length === 12) {
    return phone.slice(3);
  }
  return "";
};

type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export function mergeCommonKeys<
  T extends Record<string, any>,
  U extends Record<string, any>
>(target: Writable<T>, source: U): T {
  Object.keys(target).forEach(key => {
    if (key in source) {
      target[key] = source[key];
    }
  });
  return target;
}

export const generateRandomID = (): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";
  for (let i = 0; i < charactersLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const filterObjectValues = (
  obj: Record<string, any>
): Record<string, any> => {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value));
};

export const togglePageScrolling = (disable = false) => {
  document.documentElement.classList.toggle("el-popup-parent--hidden", disable);
};

export class Name {
  uz: string;
  ru: string;

  constructor(uz: string = "", ru: string = "") {
    this.uz = uz;
    this.ru = ru;
  }
}

export const getStatus = (status: StatusType) => {
  return status === "active";
};

export const setStatus = (status: boolean): StatusType => {
  return status ? "active" : "inactive";
};

export const getStatusText = (status: boolean | StatusType): StatusTextType => {
  if (typeof status === "string") {
    status = getStatus(status as StatusType);
  }
  return status ? "Деактивация" : "Активация";
};

export const deepEqual = (
  obj1: Record<string, any>,
  obj2: Record<string, any>
) => {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
};

export const formatDate2 = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export const setTableColumnIndex = (
  index: number,
  page: number | null,
  per_page: number
) => {
  if (!page) page = 1;
  return index + 1 + (page - 1) * per_page;
};

export const getRouteQuery = (
  query: LocationQuery | Record<string, string>,
  items: Record<string, "number" | "string" | "boolean">
): Record<string, any> => {
  const result: Record<string, any> = {};

  Object.entries(items).forEach(([key, type]) => {
    if (query[key] !== undefined) {
      const value = String(query[key] ?? "");
      const stringValue = Array.isArray(value) ? value[0] : value;

      switch (type) {
        case "number": {
          const numberValue = parseInt(stringValue, 10);
          if (!isNaN(numberValue)) {
            result[key] = numberValue;
          }
          break;
        }
        case "string": {
          result[key] = stringValue;
          break;
        }
        case "boolean": {
          if (stringValue === "true") {
            result[key] = true;
          } else if (stringValue === "false") {
            result[key] = false;
          }
          break;
        }
      }
    }
  });

  return result;
};
