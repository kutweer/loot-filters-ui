import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    TextField,
} from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useUiStore } from '../store/store'
import { FilterModule, ModuleSource } from '../types/ModularFilterSpec'
import { loadFilter } from '../utils/modularFilterLoader'
import { Option, UISelect } from './inputs/UISelect'

interface ImportFilterDialogProps {
    open: boolean
    onClose: () => void
    filtersForImport: Array<{ name: string; url?: string }>
}

export const ImportFilterDialog: React.FC<ImportFilterDialogProps> = ({
    open,
    onClose,
    filtersForImport,
}) => {
    const [filterUrl, setFilterUrl] = useState('')
    const [filterNameOverride, setFilterNameOverride] = useState('')
    const [importError, setImportError] = useState('')

    const addImportedModularFilter = useUiStore(
        (state) => state.addImportedModularFilter
    )
    const setActiveFilterId = useUiStore((state) => state.setActiveFilterId)

    const handleImportFilterChange = useCallback(
        (newValue: Option<string> | null) => {
            if (newValue) {
                setFilterUrl(newValue.value)
                setImportError('')
            }
        },
        []
    )

    const handleClose = () => {
        setFilterUrl('')
        setFilterNameOverride('')
        onClose()
    }

    return (
        <Dialog fullWidth open={open} onClose={handleClose}>
            <DialogTitle>Import Filter</DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        marginBottom: 2,
                    }}
                >
                    <FormControl>
                        <FormHelperText sx={{ fontSize: '24px' }}>
                            Select a commonly used filter or paste a URL below
                        </FormHelperText>
                        <UISelect<string>
                            options={filtersForImport.map((filter) => ({
                                label: filter.name,
                                value: filter.hasOwnProperty('url')
                                    ? (filter as { url: string }).url
                                    : JSON.stringify(filter),
                            }))}
                            value={
                                filterUrl
                                    ? { label: filterUrl, value: filterUrl }
                                    : null
                            }
                            onChange={handleImportFilterChange}
                            label="Select a filter"
                            multiple={false}
                        />
                    </FormControl>
                    <TextField
                        label="Filter URL"
                        value={filterUrl}
                        onChange={(e) => {
                            setFilterUrl(e.target.value)
                            setImportError('')
                        }}
                        error={importError !== ''}
                        helperText={importError}
                    />
                    <TextField
                        label="Filter Name Override"
                        value={filterNameOverride}
                        onChange={(e) => {
                            setFilterNameOverride(e.target.value)
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        disabled={!filterUrl.startsWith('http')}
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            setImportError('')
                            if (filterUrl.startsWith('http')) {
                                loadFilter({
                                    filterUrl: filterUrl,
                                })
                                    .catch((error) => {
                                        setImportError(error.message)
                                    })
                                    .then((filter) => {
                                        if (filter) {
                                            if (filterNameOverride !== '') {
                                                filter.name = filterNameOverride
                                            }
                                            addImportedModularFilter(filter)
                                            setActiveFilterId(filter.id)
                                            setFilterUrl('')
                                            handleClose()
                                        }
                                    })
                            } else {
                                const filter = {
                                    ...JSON.parse(filterUrl),
                                    id: crypto.randomUUID(),
                                }

                                filter.modules = filter.modules.map(
                                    (module: ModuleSource) => ({
                                        ...(
                                            module as {
                                                moduleJson: FilterModule
                                            }
                                        ).moduleJson,
                                        id: crypto.randomUUID(),
                                    })
                                )
                                if (filterNameOverride !== '') {
                                    filter.name = filterNameOverride
                                }

                                addImportedModularFilter(filter)
                                setActiveFilterId(filter.id)
                                setFilterUrl('')
                                handleClose()
                            }
                        }}
                    >
                        Import
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}
