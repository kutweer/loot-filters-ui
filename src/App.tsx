import { Alert, Container, Snackbar, Typography } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { ReactNode, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/AppHeader'
import { ErrorBoundary } from './components/ErrorBoundary'
import { FilterSelector } from './components/FilterSelector'
import { DebugPage } from './pages/DebugPage'
import { ImportPage } from './pages/ImportPage'
import { FilterTabs } from './pages/CustomizeFilterPage'
import { ModuleBuilderPage } from './pages/ModuleBuilderPage'
import { ModuleEditPage } from './pages/ModuleEditPage'
import { useAlertStore } from './store/alerts'
import { useUiStore } from './store/store'
import { MuiRsTheme } from './styles/MuiTheme'
import { PrimaryNavTab } from './components/AppHeader'

const Page: React.FC<{
    primaryNavTab: PrimaryNavTab
    component?: ReactNode
}> = ({ primaryNavTab: page, component }) => {
    const setSiteConfig = useUiStore((state) => state.setSiteConfig)
    const params = new URLSearchParams(window.location.search)
    const devMode = params.get('dev') === 'true'

    const alerts = useAlertStore((state) => state.alerts)
    const isAlerts = Boolean(alerts.length)
    const closeAlert = useAlertStore((state) => state.removeAlert)

    let buildInfo = { gitSha: 'main' }
    try {
        buildInfo = require('./build-info.json')
    } catch {
        console.warn('Could not load build info, using default')
    }

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
                <Header primaryNavTab={page} />
                <div style={{ display: 'flex' }}>
                    <Typography
                        sx={{ marginLeft: 'auto' }}
                        variant="body2"
                        color="text.secondary"
                    >
                        version: {buildInfo.gitSha.slice(0, 7)}
                    </Typography>
                </div>
            </ErrorBoundary>

            {component}
        </Container>
    )
}

export const App = () => {
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
                    <Route path="/import" element={<ImportPage />} />
                    <Route
                        path="/debug"
                        element={
                            <Page
                                component={<DebugPage />}
                                primaryNavTab={null}
                            />
                        }
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
                                primaryNavTab="filters"
                            />
                        }
                    />
                    <Route
                        path="/modules/:id"
                        element={
                            <Page
                                component={<ModuleEditPage />}
                                primaryNavTab="editModule"
                            />
                        }
                    />
                    <Route
                        path="/modules"
                        element={
                            <Page
                                component={<ModuleBuilderPage />}
                                primaryNavTab="modules"
                            />
                        }
                    />
                    <Route path="/save-me" element={<div />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
