import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlertStore } from '../store/alerts'
import { useUiStore } from '../store/store'
import { parseComponent } from '../utils/link'

export const ImportPage = () => {
    const navigate = useNavigate()
    const addImportedModularFilter = useUiStore(
        (state) => state.addImportedModularFilter
    )
    const setActiveFilterId = useUiStore((state) => state.setActiveFilterId)

    const params = new URLSearchParams(window.location.search)
    const importData = params.get('importData')

    const addFilterConfiguration = useUiStore(
        (state) => state.addFilterConfiguration
    )

    const addAlert = useAlertStore((state) => state.addAlert)

    useEffect(() => {
        if (importData) {
            try {
                const { filter, config } = parseComponent(importData)
                addImportedModularFilter(filter)
                setActiveFilterId(filter.id)
                addFilterConfiguration(filter.id, config)
                addAlert({
                    children: 'Filter imported successfully',
                    severity: 'success',
                })
                // Redirect to home page after successful import
                setTimeout(() => {
                    navigate('/')
                }, 2000)
            } catch (error) {
                console.error(error, importData)
                addAlert({
                    children: `Failed to parse import link: ${error}`,
                    severity: 'error',
                })
            }
        }
    }, [importData, addImportedModularFilter, setActiveFilterId, navigate])

    return null
}
