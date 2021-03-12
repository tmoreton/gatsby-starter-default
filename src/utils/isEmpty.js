export default (str) => {
  return (!str || 0 === str.length || str === null || str === {} || Object.keys(str).length === 0)
}