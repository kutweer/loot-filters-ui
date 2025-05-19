import React from 'react'
import { Search, Clear } from '@mui/icons-material'
import { TextField, InputAdornment, IconButton } from '@mui/material'

import { useSearchStore } from '../store/search'

export const SearchBar: React.FC<{}> = () => {
    const { search, setSearch } = useSearchStore()

    return (
        <TextField
            sx={{ minWidth: '20rem' }}
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search color="primary" />
                        </InputAdornment>
                    ),
                    endAdornment: search !== '' && (
                        <InputAdornment position="end">
                            <IconButton>
                                <Clear onClick={() => setSearch('')} />
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
    )
}
