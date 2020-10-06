function modifyValuesByLang(arr, attrb, lang){
  if(lang = "ar") {
    return getArabicValues(arr, attrb)
  } else {
    return getEnglishValues(arr, attrb)
  }
}

function getArabicValues(arr, attrb) {
  return arr.map(obj => {
    obj[attrb] = obj[attrb].arabic;
    return obj;
  });
}

function getEnglishValues(arr, attrb) {
  return arr.map(obj => {
    obj[attrb] = obj[attrb].english;
    return obj;
  });
}

export { modifyValuesByLang }
