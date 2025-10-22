var toast = null

export function setToast(_toast) {
  toast = _toast
}

export function displaySuccessToast(msg) {
  if (!toast) {
    console.warn('Missing toast !')
    return
  }

  toast.add({
    severity: 'success',
    summary: 'Succès',
    detail: msg,
    life: 3000,
  })
}

export function displayErrToast(msg) {
  if (!toast) {
    console.warn('Missing toast !')
    return
  }

  toast.add({
    severity: 'error',
    summary: 'Échec',
    detail: msg,
    life: 3000,
  })
}
