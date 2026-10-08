import { useState } from 'react'
import { readStored, storageKeys, writeStored } from './storage'

// Prototype accounts: kept in this browser only. There is no backend, and passwords are never stored.
export type Account = {
  fullName: string
  email: string
}

export const demoAccount: Account = { fullName: 'Alex Novak', email: 'alex.novak@example.com' }

export function readAccount() {
  return readStored<Account | null>(storageKeys.account, null)
}

export function isSignedIn() {
  return readStored<boolean>(storageKeys.signedIn, false) && !!readAccount()
}

export function register(account: Account) {
  writeStored(storageKeys.account, account)
  writeStored(storageKeys.signedIn, true)
  // A new account starts its own rehabilitation setup.
  writeStored(storageKeys.care, null)
}

// Accepts the account registered on this device or the demo account; any password works in the prototype.
export function logIn(email: string): Account | null {
  const normalized = email.trim().toLowerCase()
  const stored = readAccount()
  const account =
    stored && stored.email.toLowerCase() === normalized
      ? stored
      : normalized === demoAccount.email
        ? demoAccount
        : null
  if (!account) return null
  writeStored(storageKeys.account, account)
  writeStored(storageKeys.signedIn, true)
  return account
}

export function logOut() {
  writeStored(storageKeys.signedIn, false)
}

export const firstName = (fullName: string) => fullName.trim().split(/\s+/)[0] ?? ''

export const initialsOf = (fullName: string) =>
  fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

export function useAccount() {
  const [account] = useState(readAccount)
  return account
}
