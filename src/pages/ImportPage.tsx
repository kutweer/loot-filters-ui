import { Alert, AlertColor, Container } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUiStore } from '../store/store'
import { parseComponent } from '../utils/link'

export const ImportPage = () => {
    const navigate = useNavigate()
    const addImportedModularFilter = useUiStore(
        (state) => state.addImportedModularFilter
    )
    const setActiveFilterId = useUiStore((state) => state.setActiveFilterId)
    const [alerts, setAlerts] = useState<{ text: string; severity: string }[]>(
        []
    )

    const params = new URLSearchParams(window.location.search)
    const importData = params.get('importData')

    const addFilterConfiguration = useUiStore(
        (state) => state.addFilterConfiguration
    )

    useEffect(() => {
        if (importData) {
            try {
                const { filter, config } = parseComponent(importData)
                addImportedModularFilter(filter)
                setActiveFilterId(filter.id)
                addFilterConfiguration(filter.id, config)
                setAlerts([
                    {
                        text: 'Filter imported successfully redirecting...',
                        severity: 'success',
                    },
                ])
                // Redirect to home page after successful import
                setTimeout(() => {
                    navigate('/')
                }, 2000)
            } catch (error) {
                console.error(error, importData)
                setAlerts([
                    {
                        text: `Failed to parse import link: ${error}`,
                        severity: 'error',
                    },
                ])
            }
        }
    }, [importData, addImportedModularFilter, setActiveFilterId, navigate])

    return (
        <Container>
            {alerts.map((alert) => (
                <Alert key={alert.text} severity={alert.severity as AlertColor}>
                    {alert.text}
                </Alert>
            ))}
        </Container>
    )
}
