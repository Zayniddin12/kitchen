export const formatDate = (date: Date) => {
  const daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

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

export const generateRandomID = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";
  for (let i = 0; i < charactersLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};