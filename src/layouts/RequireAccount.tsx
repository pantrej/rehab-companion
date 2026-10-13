import { Navigate, Outlet } from 'react-router'
import { isSignedIn } from '../utils/auth'
import { hasPendingSetup } from '../utils/care'

// Every app screen needs a (mock) signed-in account. Someone who has just finished setting up their
// rehabilitation resumes at the account step, so that setup isn't lost; everyone else starts at Welcome.
export function RequireAccount() {
  if (isSignedIn()) return <Outlet />
  return <Navigate to={hasPendingSetup() ? '/register' : '/welcome'} replace />
}
