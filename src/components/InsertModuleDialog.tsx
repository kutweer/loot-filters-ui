import { useState } from 'react'
import { UiModularFilter } from '../types/ModularFilterSpec'
import { Box, Dialog, Typography } from '@mui/material'
import { UISelect, Option } from './inputs/UISelect'

export const InsertModuleDialog: React.FC<{ filter: UiModularFilter }> = ({
    filter,
}) => {
    const [placement, setPlacement] = useState<Option<string> | null>({
        value: 'Before',
        label: 'Before',
    })
    const [position, setPosition] = useState<Option<number> | null>(null)

    return (
        <Dialog open={true} fullWidth>
            <Box padding={2}>
                <Typography variant="h5">Insert Module</Typography>

                <UISelect
                    sx={{ width: '150px' }}
                    value={placement}
                    options={['Before', 'After'].map((v) => ({
                        label: v,
                        value: v,
                    }))}
                    onChange={(o) => {
                        setPlacement(o)
                    }}
                />
                <UISelect<number>
                    sx={{ width: '150px' }}
                    value={position}
                    options={filter.modules.map((m, i) => ({
                        label: m.name,
                        value: i,
                    }))}
                    onChange={(o) => {
                        setPosition(o)
                    }}
                />
            </Box>
        </Dialog>
    )
}
