import { random } from 'lodash-es'

export default (loading) => function * () {
  loading(true)
  // fake a timeout. could be ajax or what have you,
  yield randomTimeout()
  loading(false)
}

function randomTimeout() {
  return new Promise((resolve) => setTimeout(resolve, random(5000)))
}
