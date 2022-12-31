export const isNonEmptyArray = array => array && array instanceof Array && array.length;

export const shuffleArray = array => array && array
  .map(value => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value)
