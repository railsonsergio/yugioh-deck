export function randomNumbers(maxNumber: number, maxItems: number) {
  const numbers: number[] = [];
  let iterator = 0;

  do {
    for (iterator; iterator < maxNumber; iterator++) {
      const randomNumber = Math.floor(Math.random() * (maxNumber + 1));

      if (!numbers.includes(randomNumber)) {
        numbers.push(randomNumber);
        break;
      } else iterator -= 1;
    }
  } while (numbers.length < maxItems);

  return numbers;
}

export function snapPoint(
  value: number,
  velocity: number,
  points: ReadonlyArray<number>
) {
  'worklet';
  const point = value + 0.2 * velocity;
  const deltas = points.map(p => Math.abs(point - p));
  const minDelta = Math.min.apply(null, deltas);
  return points.filter(p => Math.abs(point - p) === minDelta)[0];
}
