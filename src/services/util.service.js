import { countriesCodeMap } from 'src/assets/jsons/countries'

export function convertDateToUtcTS(date) {
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  )
}

export function formatDateVerbal(dateStr) {
  const date = new Date(dateStr)
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const day = date.getDate()
  const monthIndex = date.getMonth()
  const year = date.getFullYear()

  return `${monthNames[monthIndex]} ${formatDay(day)}, ${year}`
}

function formatDay(day) {
  if (day > 3 && day < 21) return day + 'th' // for 4th to 20th
  switch (day % 10) {
    case 1:
      return day + 'st'
    case 2:
      return day + 'nd'
    case 3:
      return day + 'rd'
    default:
      return day + 'th'
  }
}

export function isValueEmpty(value) {
  return value === null || value === undefined || value === ''
}

export function makeId(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let res = ''
  for (let i = 0; i < length; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return res
}

// Countries helpers

export function getCountries() {
  return Object.values(countriesCodeMap).map((c) => c.countryName)
}

export function getCountriesOptions() {
  const options = Object.entries(countriesCodeMap).map(([code, data]) => ({
    label: data.countryName,
    value: code,
    description: code,
    flagURL: getFlagUrl(code) || '/imgs/placeholder_flag.jpg',
  }))
  return options
}

export function getFlagUrl(countryCode) {
  const country = countriesCodeMap[countryCode]
  const iso2Code = country?.alpha2Code?.toLowerCase()

  return iso2Code ? `https://flagcdn.com/w80/${iso2Code}.png` : ''
}

export function getCountryFullName(countryCode) {
  if (!countryCode || !countriesCodeMap[countryCode]) return ''
  return countriesCodeMap[countryCode].countryName
}


