import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Typography } from '@mui/material'

interface Props {
    children: ReactNode
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
                <Typography color="error" variant="body1">
                    Something went wrong. Please try refreshing the page.
                    <br />
                    If the problem persists, reach out on discord, with this
                    error message:
                    <br />
                    <br />
                    <pre>{this.state.error?.message}</pre>
                </Typography>
            )
        }

        return this.props.children
    }
}
