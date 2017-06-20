export default function * idGenerator() {
  const users = Object
    .keys(localStorage)
    .filter((k) => k.indexOf('users.') === 0)
    .map((k) => parseInt(k.replace('users.', '')))

  let i = users[users.length - 1] + 1 || 0

  while (true) { // eslint-disable-line no-constant-condition
    yield i++
  }
}
