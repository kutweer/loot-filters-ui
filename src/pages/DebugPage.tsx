import { Box, Button, Container } from '@mui/material'
import { Header } from '../components/AppHeader'
import { downloadFile } from '../utils/file'
import { useNavigate } from 'react-router-dom'

export const DebugPage = () => {
    const nav = useNavigate()
    return (
        <Container maxWidth="lg">
            <Header />
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
                    sx={{ width: '250px', mt: 50 }}
                    variant="outlined"
                    onClick={() => {
                        const state = localStorage.getItem(
                            'modular-filter-storage'
                        )
                        const fileName = `filterscape_state_${Date.now()
                            .toString()
                            .replaceAll('/', '-')}.json`
                        const file = new File([state ?? '{}'], fileName, {
                            type: 'text/plain',
                        })
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
                                localStorage.setItem(
                                    'modular-filter-storage',
                                    content
                                )
                                nav('/')
                            }
                            reader.readAsText(file)
                        }}
                    />
                </Button>
            </Box>
        </Container>
    )
}
