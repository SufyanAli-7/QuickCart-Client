import { message } from 'antd'

// window.getRandomId = () => {
//   return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
// }

// window.isEmailValid = (email) => {
//   const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
//   return re.test(String(email).toLowerCase())
// }

window.toastify = (msg, type) => message[type](msg)