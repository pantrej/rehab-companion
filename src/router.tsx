import { Suspense, lazy } from 'react'
import { Navigate, createBrowserRouter } from 'react-router'
import { MobileLayout } from './layouts/MobileLayout'
import { RequireAccount } from './layouts/RequireAccount'
import { AppointmentScreen } from './screens/AppointmentScreen'
import { CheckInScreen } from './screens/CheckInScreen'
import { ExerciseScreen } from './screens/ExerciseScreen'
import { HomeScreen } from './screens/HomeScreen'
import { HomeScreenClassic } from './screens/HomeScreenClassic'
import { InsightScreen } from './screens/InsightScreen'
import { LoginScreen } from './screens/LoginScreen'
import { OnboardingScreen } from './screens/OnboardingScreen'
import { PlanChangesScreen } from './screens/PlanChangesScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { ProgressScreen } from './screens/ProgressScreen'
import { RegisterScreen } from './screens/RegisterScreen'
import { SummaryScreen } from './screens/SummaryScreen'
import { SupportScreen } from './screens/SupportScreen'
import { SupportTopicScreen } from './screens/SupportTopicScreen'
import { TherapistScreen } from './screens/TherapistScreen'
import { WelcomeScreen } from './screens/WelcomeScreen'
import { hasPendingSetup } from './utils/care'

// Loaded only when visited, so the showcase never weighs on the prototype.
const DesignSystemPage = lazy(() => import('./design-system/DesignSystemPage').then((m) => ({ default: m.DesignSystemPage })))

// Every visit to the app starts at Welcome, which leads into setup and ends at the account step. A setup
// finished without an account resumes there instead, so a reload never loses it. Only a fresh load of the
// root is redirected, so in-app navigation to Today and direct links keep working.
if (window.location.pathname === '/' && !window.location.search) {
  window.history.replaceState(null, '', hasPendingSetup() ? '/register' : '/welcome')
}

export const router = createBrowserRouter([
  {
    // Entry and account: public. Onboarding comes first, before an account exists.
    element: <MobileLayout nav={false} />,
    children: [
      { path: 'onboarding', element: <OnboardingScreen /> },
      { path: 'welcome', element: <WelcomeScreen /> },
      { path: 'login', element: <LoginScreen /> },
      { path: 'register', element: <RegisterScreen /> },
    ],
  },
  {
    element: <RequireAccount />,
    children: [
      {
        // Tabs: the bottom navigation is visible.
        element: <MobileLayout />,
        children: [
          { index: true, element: <HomeScreen /> },
          // The Home before the daily carousel, for the case study before/after.
          { path: 'home-classic', element: <HomeScreenClassic /> },
          { path: 'progress', element: <ProgressScreen /> },
          { path: 'support', element: <SupportScreen /> },
          { path: 'support/:topicId', element: <SupportTopicScreen /> },
          { path: 'profile', element: <ProfileScreen /> },
        ],
      },
      {
        // Focused flows: one task at a time, no tab bar.
        element: <MobileLayout nav={false} />,
        children: [
          { path: 'session', element: <ExerciseScreen /> },
          { path: 'check-in', element: <CheckInScreen /> },
          { path: 'insight', element: <InsightScreen /> },
          { path: 'summary', element: <SummaryScreen /> },
          { path: 'appointment', element: <AppointmentScreen /> },
          { path: 'therapist', element: <TherapistScreen /> },
          { path: 'plan-changes', element: <PlanChangesScreen /> },
        ],
      },
    ],
  },
  // Portfolio showcase of the visual system. Public, full width, outside the app frame.
  {
    path: 'design-system',
    element: (
      <Suspense fallback={null}>
        <DesignSystemPage />
      </Suspense>
    ),
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
