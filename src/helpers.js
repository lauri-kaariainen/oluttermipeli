const seededRandom = function(seed, max, min) {
  max = max || 1;
  min = min || 0;
  const seedNum = (seed * 9301 + 49297) % 233280;
  const rnd = seedNum / 233280;
  return min + rnd * (max - min);
};

export const getSeededSampleOfN = (arr, n = 12, seed = 1) =>
  Array.from(new Array(n)).map(
    (_, i) =>
      arr[
        Math.floor(
          seededRandom(
            ((seed + 11) * 55 * (i + 1) + 49) % arr.length,
            arr.length,
            0
          )
        )
      ]
  );

export function shuffle(oldArray) {
  const array = JSON.parse(JSON.stringify(oldArray));
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const uniqueShallow = (item, i, arr) => !arr.slice(i + 1).includes(item);
