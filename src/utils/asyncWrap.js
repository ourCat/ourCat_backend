/**
 * express router 에서 async await를 사용할 수 있도록 해줌
 * @param {function} fn 
 * @returns {function}
 */
function asyncWrap(fn) {
  return async function(req, res, next) {
    try {
      return await fn(req, res ,next)
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = asyncWrap