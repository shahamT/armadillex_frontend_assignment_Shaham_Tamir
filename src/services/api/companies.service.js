import { getFlagUrl, makeId } from '../util.service'

export const companiesService = {
  getCompanies,
  getDefaultFilterBy,
  saveCompany,
  getCompanyById,
  getEmptyCompany,
  getCompaniesOptions,
}

const COMPANIES_STORAGE_KEY = 'COMPANIES'

//------CRUDL------

//Get Companies

async function getCompanies(filterBy = getDefaultFilterBy()) {
  let companies = loadCompaniesFromStorage()

  if (!companies) {
    companies = createDemoCompanies()
  }

  const refactored = _refactorCompanies(companies)

  const filtered = refactored.filter((c) => {
    const matchesSearch =
      !filterBy.search ||
      c.name?.toLowerCase().includes(filterBy.search.toLowerCase()) ||
      c.legalName?.toLowerCase().includes(filterBy.search.toLowerCase())

    const matchesCountry = !filterBy.country || c.country === filterBy.country
    const matchesActive = filterBy.active || c.active
    const matchesAI = !filterBy.ai || c.providesAiServices
    const matchesDPF = !filterBy.dpf || c.isDpfFound

    return (
      matchesSearch &&
      matchesCountry &&
      matchesActive &&
      matchesAI &&
      matchesDPF
    )
  })

  const sorted = [...filtered].sort((a, b) => {
    const dir = filterBy.sortDir === 'desc' ? -1 : 1
    const aVal = a[filterBy.sortBy]
    const bVal = b[filterBy.sortBy]

    if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
      if (aVal === bVal) return 0
      return (aVal ? -1 : 1) * dir
    }

    const aStr = aVal?.toString().toLowerCase()
    const bStr = bVal?.toString().toLowerCase()
    if (aStr < bStr) return -1 * dir
    if (aStr > bStr) return 1 * dir
    return 0
  })

  const pageSize = 15
  const startIdx = (filterBy.page - 1) * pageSize
  const paginated = sorted.slice(startIdx, startIdx + pageSize)

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        companies: paginated,
        total: filtered.length,
      })
    }, 500)
  })
}

// Save Company

function saveCompany(company) {
  const companies = loadCompaniesFromStorage() || []

  const rawCompany = _refactorToRawCompany(company)

  const isNew = !rawCompany.company_id

  if (isNew) {
    rawCompany.company_id = makeId()
    rawCompany.date_added = new Date().toUTCString()
    companies.push(rawCompany)
  } else {
    const idx = companies.findIndex(
      (c) => c.company_id === rawCompany.company_id,
    )
    if (idx !== -1) {
      companies[idx] = { ...companies[idx], ...rawCompany }
    } else {
      rawCompany.date_added = new Date().toUTCString()
      companies.push(rawCompany)
    }
  }

  localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(companies))

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(_refactorCompany(rawCompany))
    }, 1000)
  })
}

//get company by ID

function getCompanyById(companyId) {
  const companies = loadCompaniesFromStorage() || []
  const company = companies.find((c) => c.company_id === companyId) || null
  const formatted = _refactorCompany(company)

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(formatted)
    }, 1000)
  })
}

//======== Helpers ========
function createDemoCompanies() {
  localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(demoCompanies))
  return demoCompanies
}

function loadCompaniesFromStorage() {
  const json = localStorage.getItem(COMPANIES_STORAGE_KEY)
  return json ? JSON.parse(json) : null
}

function getEmptyCompany() {
  return {
    id: null,
    name: '',
    legalName: '',
    country: '',
    active: false,
    dateAdded: null,
    isDpfFound: false,
    providesAiServices: false,
    parentId: null,
  }
}

function getDefaultFilterBy() {
  return {
    search: '',
    country: '',
    active: false,
    ai: false,
    dpf: false,
    sortBy: 'dateAdded',
    sortDir: 'desc',
    page: 1,
  }
}

//refactor array of companies
function _refactorCompanies(companies) {
  return companies.map((company) => ({
    id: company.company_id,
    active: company.active,
    name: company.company_name,
    legalName: company.company_legal_name,
    country: company.country,
    dateAdded: company.date_added,
    isDpfFound: company.dpf_found,
    parentId: company.parent_id,
    providesAiServices: company.provides_ai_services,
  }))
}

//refactor single company
function _refactorCompany(company) {
  return {
    id: company.company_id,
    active: company.active,
    name: company.company_name,
    legalName: company.company_legal_name,
    country: company.country,
    dateAdded: company.date_added,
    isDpfFound: company.dpf_found,
    parentId: company.parent_id,
    providesAiServices: company.provides_ai_services,
  }
}
//refactor single company to raw
function _refactorToRawCompany(formatted) {
  return {
    company_id: formatted.id,
    company_name: formatted.name,
    company_legal_name: formatted.legalName,
    country: formatted.country,
    active: formatted.active,
    date_added: formatted.dateAdded,
    dpf_found: formatted.isDpfFound,
    provides_ai_services: formatted.providesAiServices,
    parent_id: formatted.parentId,
  }
}

//Ai name suggestions

function getCompaniesOptions() {
  const options = DemoAISuggestions
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(options)
    }, 2000)
  })
}

//====== Demo Data =======
var demoCompanies = [
  {
    active: true,
    company_id: 'pAuC6RQ71bBG',
    company_legal_name: 'Market Data Insights LLC',
    company_name: 'Market Data Insights LLC',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:54:36 GMT',
    dpf_found: false,
    parent_id: 'hDQkIp9PldZO',
    provides_ai_services: true,
  },
  {
    active: false,
    company_id: 'sL4O0q46zTGJ',
    company_legal_name: 'TreSensa Technologies, Inc.',
    company_name: 'TreSensa Technologies, Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:54:37 GMT',
    dpf_found: false,
    parent_id: null,
    provides_ai_services: false,
  },
  {
    active: true,
    company_id: 'aRxlTZVm6Kr3',
    company_legal_name: 'Trialize Inc.',
    company_name: 'Trialize Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:54:35 GMT',
    dpf_found: false,
    parent_id: 'nm5sbfa3H1AU',
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'hQPRqF23sFWr',
    company_legal_name: 'Zimmer Biomet Holdings, Inc.',
    company_name: 'Zimmer Biomet',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:38:24 GMT',
    dpf_found: true,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'zS5p8AZDKHAy',
    company_legal_name: 'Priory Solutions LLC',
    company_name: 'Priory Solutions LLC',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:54:36 GMT',
    dpf_found: false,
    parent_id: 'hDQkIp9PldZO',
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'hDQkIp9PldZO',
    company_legal_name: 'TRGRP, Inc.',
    company_name: 'TRGRP, Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:54:36 GMT',
    dpf_found: true,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'nOLii2vnnMTf',
    company_legal_name: 'Treno, Inc.',
    company_name: 'Treno',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:54:37 GMT',
    dpf_found: false,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: false,
    company_id: 'tAx3qMDrjrZi',
    company_legal_name: 'Trendline Interactive Holdings, LLC',
    company_name: 'Trendline Interactive Holdings, LLC',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:54:37 GMT',
    dpf_found: false,
    parent_id: null,
    provides_ai_services: false,
  },
  {
    active: true,
    company_id: 'dKhnUGcBrp3s',
    company_legal_name: 'ZipHQ, Inc.',
    company_name: 'ZipHQ, Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:37:59 GMT',
    dpf_found: true,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: false,
    company_id: 'g2pvCB3qIzRs',
    company_legal_name: 'ZipGrade LLC',
    company_name: 'ZipGrade LLC',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:38:00 GMT',
    dpf_found: false,
    parent_id: null,
    provides_ai_services: false,
  },
  {
    active: true,
    company_id: 'wHcoH1EfthBT',
    company_legal_name: 'Zywave, Inc.',
    company_name: 'Zywave, Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:41 GMT',
    dpf_found: true,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'j004dr5oc4HX',
    company_legal_name: 'Zyper Inc',
    company_name: 'Zyper Inc',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:42 GMT',
    dpf_found: false,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'wZ7fnSNyny8U',
    company_legal_name: 'Zynga Inc.',
    company_name: 'Zynga',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:43 GMT',
    dpf_found: false,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: false,
    company_id: 'q5xRMZERwO6M',
    company_legal_name: "Town's End Studios LLC",
    company_name: "Town's End Studios LLC",
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:43 GMT',
    dpf_found: false,
    parent_id: 'wZ7fnSNyny8U',
    provides_ai_services: false,
  },
  {
    active: true,
    company_id: 'kIBhSOdMH8US',
    company_legal_name: 'Rising Tide Games, Inc.',
    company_name: 'Rising Tide Games, Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:43 GMT',
    dpf_found: false,
    parent_id: 'wZ7fnSNyny8U',
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'fJitPwzxnaEo',
    company_legal_name: 'PuzzleSocial, Inc.',
    company_name: 'PuzzleSocial, Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:44 GMT',
    dpf_found: false,
    parent_id: 'wZ7fnSNyny8U',
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'wbqvkyXHLl08',
    company_legal_name: 'Spooky Cool Labs LLC',
    company_name: 'Spooky Cool Labs LLC',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:44 GMT',
    dpf_found: false,
    parent_id: 'wZ7fnSNyny8U',
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'oT0ypIGOe79c',
    company_legal_name: 'Zylo',
    company_name: 'Zylo',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:44 GMT',
    dpf_found: false,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: true,
    company_id: 'dBXlnpbGPpZ9',
    company_legal_name: 'Zwift, Inc',
    company_name: 'Zwift, Inc',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:45 GMT',
    dpf_found: false,
    parent_id: null,
    provides_ai_services: true,
  },
  {
    active: false,
    company_id: 'iT33B4uGCTqX',
    company_legal_name: 'Leeyo Software Inc.',
    company_name: 'Leeyo Software Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:45 GMT',
    dpf_found: false,
    parent_id: 'oiGMSMk2vNhr',
    provides_ai_services: false,
  },
  {
    active: true,
    company_id: 'sRqeq5uVVJHA',
    company_legal_name: 'Zephr US Inc.',
    company_name: 'Zephr US Inc.',
    country: 'USA',
    date_added: 'Sun, 26 Jan 2025 16:24:46 GMT',
    dpf_found: false,
    parent_id: 'oiGMSMk2vNhr',
    provides_ai_services: true,
  },
]

const DemoAISuggestions = [
  {
    label: 'EcoFlow',
    value: 'EcoFlow',
    legalName: 'EcoFlow Inc.',
    industry: 'Renewable Energy',
    description:
      'Provides portable and home battery systems for clean energy storage.',
    country: 'USA',
    flagURL: getFlagUrl('USA'),
    aiOption: true,
  },
  {
    label: 'FreshBite',
    value: 'FreshBite',
    legalName: 'FreshBite Foods Ltd.',
    industry: 'Food Delivery',
    description: 'Delivers fresh, chef-prepared meals directly to consumers.',
    country: 'GBR',
    flagURL: getFlagUrl('GBR'),
    aiOption: true,
  },
  {
    label: 'SafeLink',
    value: 'SafeLink',
    legalName: 'SafeLink Cybersecurity GmbH',
    industry: 'Cybersecurity',
    description:
      'Offers threat detection and real-time monitoring for enterprise networks.',
    country: 'DEU',
    flagURL: getFlagUrl('DEU'),
    aiOption: true,
  },
  {
    label: 'BuildPro',
    value: 'BuildPro',
    legalName: 'BuildPro Construction Co.',
    industry: 'Construction',
    description:
      'Specializes in eco-friendly commercial and residential construction projects.',
    country: 'CAN',
    flagURL: getFlagUrl('CAN'),
    aiOption: true,
  },
  // {
  //   label: 'AquaSense',
  //   value: 'AquaSense',
  //   legalName: 'AquaSense Technologies Ltd.',
  //   industry: 'Water Technology',
  //   description: 'Develops smart irrigation systems and water-saving solutions for agriculture.',
  //   country: 'AUS',
  //   flagURL: getFlagUrl('AUS'),
  //   aiOption: true,
  // },
  // {
  //   label: 'MedTrack',
  //   value: 'MedTrack',
  //   legalName: 'MedTrack Health Pte. Ltd.',
  //   industry: 'Healthcare',
  //   description: 'Creates wearable devices that monitor patient vitals in real time.',
  //   country: 'SGP',
  //   flagURL: getFlagUrl('SGP'),
  //   aiOption: true,
  // },
]
