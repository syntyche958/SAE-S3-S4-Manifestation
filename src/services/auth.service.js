import LocalSource from '@/services/localsource.service.js'

async function loginFromLocalSource(mail, password) {
  return LocalSource.login(mail, password)
}

async function signinFromLocalSource(mail, password) {
  return LocalSource.signin(mail, password)
}

// async function getUser() {
//   let response = null
//   try {
//     response = await getUserFromLocalSource()
//   } catch {
//     return { error: 1, status: 400, data: 'A network error occured : ' }
//   }

//   return response
// }

async function login(mail, password) {
  return loginFromLocalSource(mail, password)
}
async function signin(mail, password) {
  return signinFromLocalSource(mail, password)
}

export default { login, signin }
