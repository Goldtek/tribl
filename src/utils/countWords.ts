export const countWords = (word: string) => {
    return word.trim().split('').length < 1;
};