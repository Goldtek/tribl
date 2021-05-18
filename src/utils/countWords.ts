export const countWords = (word: string | null) => {
  return !word ? true : word.trim().split('').length < 1;
};
