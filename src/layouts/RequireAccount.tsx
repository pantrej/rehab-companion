import { Navigate, Outlet } from 'react-router'
import { isSignedIn } from '../utils/auth'

// Every app screen needs a (mock) signed-in account; otherwise start at the welcome screen.
export function RequireAccount() {
  return isSignedIn() ? <Outlet /> : <Navigate to="/welcome" replace />
}
