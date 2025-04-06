import { Box, Button, Container, Paper } from '@mui/material'
import { downloadFile } from '../utils/file'
import { Header } from '../components/AppHeader'

export const DebugPage = () => {
    return (
        <Container maxWidth="lg">
            <Header />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
            </Box>
        </Container>
    )
}
