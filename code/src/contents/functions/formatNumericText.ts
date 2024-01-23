const formatNumericText=(inputText:string)=>{
    // nullまたはundefinedの場合は空文字列に変換
    const stringValue = inputText == null||undefined||NaN ? '0' : inputText.toString();
    // 数値と小数点、負号以外の入力を防ぐ
    const sanitizedValue = stringValue.replace(/[^-0-9.]/g, '');
    // 先頭の負号が複数ある場合は最初のものだけ残す
    const signedValue = sanitizedValue.replace(/^-+/, match => match.length >= 2 ? '' : '-')

    const hyphenIndex = signedValue.indexOf('-');
    const hyphenformattedValue = hyphenIndex !== -1 ? signedValue.charAt(0) + signedValue.slice(hyphenIndex + 1).replace(/-/g, '') : signedValue;

    // 小数点が複数含まれている場合は最初のものだけ残す
    const dotIndex = hyphenformattedValue.indexOf('.');
    const formattedValue = dotIndex !== -1 ? hyphenformattedValue.slice(0, dotIndex + 1) + hyphenformattedValue.slice(dotIndex + 1).replace(/\./g, '') : hyphenformattedValue;

    // 小数点だけが残っている場合は0を追加
    const finalValue = (formattedValue.slice(-1) === '-')&&(formattedValue.length > 2) ? formattedValue.slice(0,-1) : formattedValue;
    const finalValue1 = finalValue === '.' ? '0.' : finalValue;
    const finalValue2 = finalValue1 === '-.' ? '-0.' : finalValue1;

    return finalValue2
}

export default formatNumericText;
