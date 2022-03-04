const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const rand = (min, max) => {
  return Math.random() * (max - min + 1) + min
}

export { randInt, rand }
export default {
  randInt: randInt,
  rand: rand
}
