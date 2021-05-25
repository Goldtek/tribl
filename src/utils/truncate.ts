export const truncateString = (str = '', length: number = 10, omission = '') => {
    if (str.length > length) {
        let subStr = str.substring(str.length - length, str.length);
        return omission + subStr;
    } else {
        return str;
    }
}