import { Alert, Container, Snackbar, Typography } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/AppHeader'
import { ErrorBoundary } from './components/ErrorBoundary'
import { FilterTabs } from './components/FilterTabs'
import { ImportPage } from './pages/ImportPage'
import { useAlertStore } from './store/alerts'
import { useUiStore } from './store/store'
import { MuiRsTheme } from './styles/MuiTheme'
import { DebugPage } from './pages/DebugPage'

const MainPage = ({ sha }: { sha: string }) => {
    const setSiteConfig = useUiStore((state) => state.setSiteConfig)
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
        <>
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
            <span style={{ display: 'none', fontFamily: 'RuneScape' }}>
                runescape
            </span>
            <span style={{ display: 'none', fontFamily: 'RuneScapeBold' }}>
                RuneScapeBold
            </span>
            <span style={{ display: 'none', fontFamily: 'RuneScapeSmall' }}>
                RuneScapeSmall
            </span>
            <Container className="rs-container" maxWidth="xl">
                <div style={{ display: 'flex' }}>
                    <ErrorBoundary>
                        <Header />
                    </ErrorBoundary>
                    <Typography
                        sx={{ marginLeft: 'auto' }}
                        variant="body2"
                        color="text.secondary"
                    >
                        version: {sha.slice(0, 7)}
                    </Typography>
                </div>
                <ErrorBoundary errorComponent={<Typography>Error</Typography>}>
                    <FilterTabs sha={sha} />
                </ErrorBoundary>
            </Container>
        </>
    )
}

export const App = ({ sha = 'main' }: { sha?: string }) => {
    return (
        <ThemeProvider theme={MuiRsTheme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage sha={sha} />} />
                    <Route path="/import" element={<ImportPage />} />
                    <Route path="/debug" element={<DebugPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
