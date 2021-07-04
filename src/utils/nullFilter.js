
/**
 * object에 속해있는 값중 value가 null인 값 제거
 * @param {Object} obj 
 * @returns {Object}
 */
module.exports = (obj) => {
  return Object.keys(obj).filter( e => obj[e] ).reduce((newObj, e) => {
    newObj[e] = obj[e]
    return newObj
  }, {})
}
