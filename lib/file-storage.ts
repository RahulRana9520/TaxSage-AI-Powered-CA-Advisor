import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

// File-based storage that persists data
const DATA_FILE = join(process.cwd(), 'data.json')

interface StorageData {
  users: Record<string, any>
  usersByEmail: Record<string, string>
  profiles: Record<string, any>
  income: Record<string, any[]>
  expenses: Record<string, any[]>
  budgets: Record<string, any[]>
  goals: Record<string, any[]>
}

let memData: StorageData = {
  users: {},
  usersByEmail: {},
  profiles: {},
  income: {},
  expenses: {},
  budgets: {},
  goals: {},
}

// Load data from file on startup
function loadData(): StorageData {
  try {
    if (existsSync(DATA_FILE)) {
      const fileData = readFileSync(DATA_FILE, 'utf8')
      return JSON.parse(fileData)
    }
  } catch (error) {
    console.error('Error loading data file:', error)
  }
  return memData
}

// Save data to file
function saveData(data: StorageData) {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error saving data file:', error)
  }
}

// Initialize data
memData = loadData()

export function getFileStorage() {
  return {
    get: () => memData,
    save: () => saveData(memData),
    
    // User operations
    getUser: (id: string) => memData.users[id],
    getUserByEmail: (email: string) => {
      const userId = memData.usersByEmail[email]
      return userId ? memData.users[userId] : null
    },
    setUser: (user: any) => {
      memData.users[user.id] = user
      memData.usersByEmail[user.email] = user.id
      saveData(memData)
    },
    
    // Profile operations
    getProfile: (userId: string) => memData.profiles[userId],
    setProfile: (profile: any) => {
      memData.profiles[profile.userId] = profile
      saveData(memData)
    },
    
    // Income operations
    getIncome: (userId: string) => memData.income[userId] || [],
    addIncome: (entry: any) => {
      if (!memData.income[entry.userId]) memData.income[entry.userId] = []
      memData.income[entry.userId].push(entry)
      saveData(memData)
    },
    
    // Expense operations
    getExpenses: (userId: string) => memData.expenses[userId] || [],
    addExpense: (entry: any) => {
      if (!memData.expenses[entry.userId]) memData.expenses[entry.userId] = []
      memData.expenses[entry.userId].push(entry)
      saveData(memData)
    },
    
    // Budget operations
    getBudget: (userId: string) => memData.budgets[userId] || [],
    setBudget: (userId: string, allocations: any[]) => {
      memData.budgets[userId] = allocations
      saveData(memData)
    },
    
    // Goals operations
    getGoals: (userId: string) => memData.goals[userId] || [],
    setGoals: (userId: string, goals: any[]) => {
      memData.goals[userId] = goals
      saveData(memData)
    },
  }
}
