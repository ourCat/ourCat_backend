/**
 * random code를 만드는 함수
 * @param {number} length 
 * @returns 
 */
function makeRandomCode(length) {
  const result = []
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  
  for( let i = 0; i < length; i++ ) {
    result.push(characters[Math.floor(Math.random() * characters.length)])
  }

  return result.join('')
}

module.exports = {
  makeRandomCode
}