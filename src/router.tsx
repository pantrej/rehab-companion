import { Navigate, createBrowserRouter } from 'react-router'
import { MobileLayout } from './layouts/MobileLayout'
import { AppointmentScreen } from './screens/AppointmentScreen'
import { CheckInScreen } from './screens/CheckInScreen'
import { ExerciseScreen } from './screens/ExerciseScreen'
import { HomeScreen } from './screens/HomeScreen'
import { InsightScreen } from './screens/InsightScreen'
import { OnboardingScreen } from './screens/OnboardingScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { ProgressScreen } from './screens/ProgressScreen'
import { SummaryScreen } from './screens/SummaryScreen'
import { SupportScreen } from './screens/SupportScreen'
import { SupportTopicScreen } from './screens/SupportTopicScreen'

export const router = createBrowserRouter([
  {
    // Tabs: the bottom navigation is visible.
    element: <MobileLayout />,
    children: [
      { index: true, element: <HomeScreen /> },
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
      { path: 'onboarding', element: <OnboardingScreen /> },
      { path: 'session', element: <ExerciseScreen /> },
      { path: 'check-in', element: <CheckInScreen /> },
      { path: 'insight', element: <InsightScreen /> },
      { path: 'summary', element: <SummaryScreen /> },
      { path: 'appointment', element: <AppointmentScreen /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
