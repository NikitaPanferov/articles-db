import { useMemo } from "react";
import { WEB_URL } from "../api";

export const copyArticleAdress = async (articleId: number) => {
    if (!navigator.clipboard) {
        console.error('Clipboard API is not available');
        return;
    }

    try {
        await navigator.clipboard.writeText(`${WEB_URL}/article/${articleId}`);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}

export function isValidRuString(input: string): string {
    return useMemo(() => {
        const regex = /[a-zA-Z]+/;
    
        return !regex.test(input) || input.length === 0  ? "" : "Поле должно содержать только кириллицу"
    }, [input])
  }
  
export function isValidEnString(input: string): string {
    return useMemo(() => {
        const regex = /[а-яА-ЯёЁ]+/;
    
        return !regex.test(input)  || input.length === 0 ? "" : "Поле должно содержать только латиницу"
    }, [input])
  }


function isValidDOI(input: string): boolean {
    // Регулярное выражение для проверки префикса DOI
    const prefixRegex = /^10\.\d+/;
    
    // Разделение префикса и суффикса
    const parts = input.split('/');
    if (parts.length !== 2) {
      return false;
    }

    const suffix = parts[1];

    // Проверка, содержит ли строка DOI корректный префикс
    if (!prefixRegex.test(input)) {
      return false;
    }
  
    // Регулярное выражение для проверки суффикса DOI
    const suffixRegex = /^[a-z0-9-]+$/i;
  
    // Проверка, содержит ли суффикс только допустимые символы
    if (!suffixRegex.test(suffix)) {
      return false;
    }
  
    // Проверка на зарезервированные символы
    const reservedChars = /[;\/?:@&=+$,]/;
    if (reservedChars.test(suffix)) {
      return false;
    }
  
    return true;
  }

  function isValidEDN(edn: string): boolean {
    // Регулярное выражение для проверки кода EDN
    const ednRegex = /^[A-Za-z]{6}$/;
  
    // Проверка, соответствует ли строка формату кода EDN
    return ednRegex.test(edn);
  }

  export const isValidIdentifier = (input: string): string => {
    return useMemo(() => {
      return (isValidDOI(input) || isValidEDN(input) || input.length === 0) ? "" : "Некорректный идентификатор"
    }, [input])
  }