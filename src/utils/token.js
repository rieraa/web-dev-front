// token 持久化

// 密钥这里写死了开头的key,正常来说需要传参处理
const TOKEN_KEY = 'hcx'

const getToken = () => localStorage.getItem(TOKEN_KEY)
const setToken = token => localStorage.setItem(TOKEN_KEY, token)
const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export { getToken, setToken, clearToken }