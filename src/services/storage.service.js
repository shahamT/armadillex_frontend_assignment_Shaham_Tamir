export const storageService = {
  get,
  set,
  remove,
}

function get(key) {
  const rawData = localStorage.getItem(key)
  return rawData ? JSON.parse(rawData) : null
}

function set(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function remove(key) {
  localStorage.removeItem(key)
}
