import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AppContextProvider } from '../contexts/AppContext';
import ReactQueryProvider from '../providers/ReactQueryProvider';
import router from '../routes';

// -------------------------------------------------------------------
// App — Root component
// StateManagement.md section 17 — Provider Hierarchy:
//   ThemeProvider
//     QueryClientProvider
//       AppContextProvider
//         RouterProvider
// -------------------------------------------------------------------
function App() {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <AppContextProvider>
          <RouterProvider router={router} />
          {/* Toast notifications — react-hot-toast */}
          {/* Architecture.md section 8 — Notifications: React Hot Toast */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: 'var(--font-interface)',
                fontSize: '14px',
                borderRadius: 'var(--radius-sm)',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AppContextProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}

export default App;
