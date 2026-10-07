import { createBrowserRouter } from 'react-router'
import { MobileLayout } from './layouts/MobileLayout'
import { HomeScreen } from './screens/HomeScreen'
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
])
