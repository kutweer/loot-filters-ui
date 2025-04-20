import { Box, Button, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { downloadFile, localState } from '../utils/file'

export const DebugPage = () => {
    const nav = useNavigate()
    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Button
                    sx={{ width: '250px', mt: 10 }}
                    variant="outlined"
                    onClick={() => {
                        const state = localState()
                        const fileName = `filterscape_state_${Date.now()
                            .toString()
                            .replaceAll('/', '-')}.json`
                        const file = new File(
                            [JSON.stringify(state)],
                            fileName,
                            {
                                type: 'text/plain',
                            }
                        )
                        downloadFile(file)
                    }}
                >
                    Download Local State
                </Button>

                <Button
                    sx={{ width: '250px' }}
                    variant="outlined"
                    component="label"
                >
                    Upload Local State
                    <input
                        type="file"
                        hidden
                        accept=".json"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (!file) return

                            const reader = new FileReader()
                            reader.onload = (e) => {
                                const content = e.target?.result as string
                                const state = JSON.parse(content)
                                Object.entries(state).forEach(
                                    ([key, value]) => {
                                        localStorage.setItem(
                                            key,
                                            (value as string) ?? null
                                        )
                                    }
                                )
                                window.location.href = `${window.location.protocol}://${window.location.host}`
                            }
                            reader.readAsText(file)
                        }}
                    />
                </Button>
                <Button
                    sx={{ width: '250px' }}
                    variant="outlined"
                    onClick={() => {
                        localStorage.clear()
                        window.location.href = `${window.location.protocol}://${window.location.host}`
                    }}
                >
                    Delete All Stored Data
                </Button>
            </Box>
        </Container>
    )
}
