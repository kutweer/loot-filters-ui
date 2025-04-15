import { Alert, Container, Snackbar } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { ReactNode, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppHeader } from './components/AppHeader'
import { ErrorBoundary } from './components/ErrorBoundary'
import { FilterSelector } from './components/FilterSelector'
import { FilterTabs } from './pages/CustomizeFilterPage'
import { DebugPage } from './pages/DebugPage'
import { EditorPage } from './pages/ParsePage'
import { useAlertStore } from './store/alerts'
import {
    MigrateLegacyData,
    requiresMigration,
} from './store/migrations/MigrateLegacyData'
import { useSiteConfigStore } from './store/siteConfigStore'
import { MuiRsTheme } from './styles/MuiTheme'

const Page: React.FC<{
    component?: ReactNode
}> = ({ component }) => {
    const { setSiteConfig } = useSiteConfigStore()
    const params = new URLSearchParams(window.location.search)
    const devMode = params.get('dev') === 'true'

    const alerts = useAlertStore((state) => state.alerts)
    const isAlerts = Boolean(alerts.length)
    const closeAlert = useAlertStore((state) => state.removeAlert)

    useEffect(() => {
        if (devMode) {
            setSiteConfig({ devMode })
        }
    }, [devMode, setSiteConfig])

    return (
        <Container className="rs-container" maxWidth="xl">
            {alerts.map((alert) => (
                <Snackbar
                    key={alert.key}
                    open={isAlerts}
                    autoHideDuration={2000}
                    onClose={() => closeAlert(0)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert {...alert} />
                </Snackbar>
            ))}
            <ErrorBoundary>
                <AppHeader />
            </ErrorBoundary>
            {component}
        </Container>
    )
}

export const App = () => {
    const doMigration = requiresMigration()
    console.log('doMigration', doMigration)
    if (doMigration && window.location.pathname !== '/debug') {
        return (
            <ThemeProvider theme={MuiRsTheme}>
                <MigrateLegacyData />
            </ThemeProvider>
        )
    }

    return (
        <ThemeProvider theme={MuiRsTheme}>
            <span style={{ display: 'none', fontFamily: 'RuneScape' }}>
                runescape
            </span>
            <span style={{ display: 'none', fontFamily: 'RuneScapeBold' }}>
                RuneScapeBold
            </span>
            <span style={{ display: 'none', fontFamily: 'RuneScapeSmall' }}>
                RuneScapeSmall
            </span>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/debug"
                        element={<Page component={<DebugPage />} />}
                    />
                    <Route
                        path="/"
                        element={
                            <Page
                                component={
                                    <ErrorBoundary
                                        beforeErrorComponent={
                                            <FilterSelector
                                                reloadOnChange={true}
                                            />
                                        }
                                    >
                                        <FilterTabs />
                                    </ErrorBoundary>
                                }
                            />
                        }
                    />
                    <Route
                        path="/editor"
                        element={<Page component={<EditorPage />} />}
                    />
                    <Route path="/save-me" element={<div />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
