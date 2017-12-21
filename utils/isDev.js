
const isDev = () => {
  const env = process.env

  if (!env) return false
  if (!env['NODE_ENV']) return false
  if (env['NODE_ENV'].toLowerCase() === 'test') return true

  return false
}
module.exports = isDev()