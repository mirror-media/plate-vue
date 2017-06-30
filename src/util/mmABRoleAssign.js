import _ from 'lodash'

const ROLE_LIST = [
  { id: 'A', weight: 80 },
  { id: 'B', weight: 10 },
  { id: 'C', weight: 10 }
]
const MAX = Math.pow(10, 10)
const MIN = Math.pow(10, 9)

export function getRole () {
  const sequence = []
  let sum = 0
  for (let i = 0; i < ROLE_LIST.length; i += 1) {
    if (sequence.length > 0) {
      sequence.push(sequence[i - 1] + ROLE_LIST[i].weight)
    } else {
      sequence.push(ROLE_LIST[i].weight)
    }
    sum += ROLE_LIST[i].weight
  }
  const random = Math.floor(Math.random() * (MAX - MIN) + MIN)
  const remainder = random % sum
  const roleInTest = _.get(_.filter(ROLE_LIST, (o, i) => {
    return remainder < sequence[i]
  }), 0)
  return roleInTest.id
}
