export default function useComp(){
  function tableFilterQuery  (filter){
    if (!filter) return "";
    let queryArray = [];
    Object.keys(filter).map((objectKey) => {
      const value = filter[objectKey];
      if (value === undefined || value === null || value.length === 0) return;
      queryArray.push(objectKey + "=" + value);
    });

    if (queryArray.length !== 0) return "?" + queryArray.join("&");
    else return "";
  }
  function num_format(num, dig=0, dec='.', sep=' ') {
    if (num === null || num === undefined || num.length === 0) {
      return 0;
    }
    num = "" + num;
    num = num.replace(",", ".");
    let x = new Array();
    let s = num < 0 ? "-" : "";
    num = Math.abs(num).toFixed(dig).split(".");
    let r = num[0].split("").reverse();
    for (let i = 1; i <= r.length; i++) {
      x.unshift(r[i - 1]);
      if (i % 3 == 0 && i != r.length) x.unshift(sep);
    }
    return s + x.join("") + (num[1] ? dec + num[1] : "");
  }

  function formatPrice(value:any) {
    if (!value) return '';

    // Faqat raqamlar va nuqtani qoldiradi, vergullarni olib tashlaydi
    const cleanedValue = String(value).replace(/,/g, '');
    const parts = cleanedValue.split('.');

    // Mingliklarni bo'shliq bilan ajratish
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    // Kasr qismini 2 ta raqamgacha cheklash
    if (parts[1]) {
      parts[1] = parts[1].slice(0, 2);
    }

    return parts.join('.');
  }

  function priceParser(value:any) {
    return value.replace(/[,\s]/g, '');
  }

  return {
    tableFilterQuery,
    num_format,
    formatPrice,
    priceParser
  }
}