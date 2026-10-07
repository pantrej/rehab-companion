import { createBrowserRouter } from 'react-router'
import { MobileLayout } from './layouts/MobileLayout'
import { CheckInScreen } from './screens/CheckInScreen'
import { ExerciseScreen } from './screens/ExerciseScreen'
import { HomeScreen } from './screens/HomeScreen'
import { OnboardingScreen } from './screens/OnboardingScreen'
import { PlaceholderScreen } from './screens/PlaceholderScreen'

export const router = createBrowserRouter([
  {
    element: <MobileLayout />,
    children: [
      { index: true, element: <HomeScreen /> },
      { path: 'progress', element: <PlaceholderScreen title="Progress" /> },
      { path: 'support', element: <PlaceholderScreen title="Support" /> },
      { path: 'profile', element: <PlaceholderScreen title="Profile" /> },
    ],
  },
  {
    element: <MobileLayout nav={false} />,
    children: [
      { path: 'onboarding', element: <OnboardingScreen /> },
      { path: 'session', element: <ExerciseScreen /> },
      { path: 'check-in', element: <CheckInScreen /> },
      // Next step in the core loop; designed later.
      { path: 'insight', element: <PlaceholderScreen title="Recovery insight" /> },
    ],
  },
])
