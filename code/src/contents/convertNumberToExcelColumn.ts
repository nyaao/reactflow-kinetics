
const convertNumberToExcelColumn = (num: number): string | null => {
    if (num <= 0) {
      return null;
    }
  
    let temp,
      letter = '';
    while (num > 0) {
      temp = (num - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      num = (num - temp - 1) / 26;
    }
    return letter;
  };

export default convertNumberToExcelColumn;
  