export const truncateString = (str: string, length: number, omission = '...') => {
    if (str.length > length) {
        let subStr = str.substring(str.length - length, str.length);
        return omission + subStr;
    } else {
        return str;
    }
}