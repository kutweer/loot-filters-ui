import { Box, Button, Typography } from '@mui/material'
import { Component, ErrorInfo, ReactNode } from 'react'
import { colors } from '../styles/MuiTheme'
import { downloadFile } from '../utils/file'

interface Props {
    children: ReactNode
    beforeErrorComponent?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div>
                    {this.props.beforeErrorComponent}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                        }}
                    >
                        <Typography
                            color="error"
                            variant="body1"
                            sx={{ textAlign: 'center', mt: 5 }}
                        >
                            Something went wrong. Please try refreshing the
                            page.
                            <br />
                            If the problem persists, reach out on discord, with
                            this error message:
                            <br />
                            <br />
                        </Typography>
                        <pre
                            style={{
                                fontSize: '16px',
                                backgroundColor: 'black',
                                color: 'white',
                                padding: '10px',
                                borderRadius: '5px',
                            }}
                        >
                            {this.state.error?.message}
                        </pre>
                        <Typography
                            sx={{
                                color: colors.rsLightestBrown,
                                textAlign: 'center',
                            }}
                            variant="body2"
                        >
                            If you're going to report this error on the discord
                            please include the app state, you can download it
                            below.
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                sx={{ width: '250px', mt: 5 }}
                                variant="outlined"
                                onClick={() => {
                                    const state = localStorage.getItem(
                                        'modular-filter-storage'
                                    )
                                    const fileName = `filterscape_state_${Date.now()
                                        .toString()
                                        .replaceAll('/', '-')}.json`
                                    const file = new File(
                                        [state ?? '{}'],
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
                        </Box>
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}
