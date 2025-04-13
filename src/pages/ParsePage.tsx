import { Editor } from '@monaco-editor/react'
import { Button, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { parse } from '../parsing/parse'

export const ParsePage = () => {
    const [editorContent, setEditorContent] = useState('')
    const [error, setError] = useState<Error | null>(null)
    const [url, setUrl] = useState(
        'https://raw.githubusercontent.com/riktenx/filterscape/refs/heads/migrate/filterscape.rs2f'
        // 'https://raw.githubusercontent.com/typical-whack/loot-filters-modules/21b862c9502a20a82e0ac02038f92fb8c8f6bd4b/filter.rs2f'
        // 'https://raw.githubusercontent.com/typical-whack/loot-filters-modules/refs/heads/migrate/filter.rs2f'
        // 'https://gist.githubusercontent.com/Kaqemeex/8b57b85303bf713167cbabe235638416/raw/58976caad9124bc99fba5ddec29932e266034e6f/foo.rs2f'
    )

    const parsed = useMemo(() => {
        try {
            return JSON.stringify(parse(editorContent), null, 2)
        } catch (e) {
            setError(e as Error)
            return (e as Error).message + '\n' + (e as Error).stack
        }
    }, [editorContent])

    useMemo(() => {
        if (!editorContent) {
            fetch(url)
                .then((res) => res.text())
                .then(setEditorContent)
        }
    }, [editorContent, url])

    return (
        <ErrorBoundary>
            <div
                style={{
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1rem',
                }}
            >
                <TextField
                    type="text"
                    placeholder="Enter URL"
                    value={url}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        fontSize: '1rem',
                        borderRadius: '4px',
                    }}
                    onChange={(e) => {
                        setUrl(e.target.value)
                    }}
                />
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                        fetch(url)
                            .then((res) => res.text())
                            .then(setEditorContent)
                    }}
                >
                    Fetch
                </Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                <div style={{ width: '50%' }}>
                    <Typography variant="h6" color="primary">
                        Filter
                    </Typography>
                    <Editor
                        height="80vh"
                        width="100%"
                        language="cpp"
                        theme="vs-dark"
                        options={{
                            minimap: {
                                enabled: false,
                            },
                            readOnly: false,
                        }}
                        value={editorContent}
                        onChange={(value) => {
                            if (value) {
                                setEditorContent(value)
                            }
                        }}
                    />
                </div>
                <div style={{ width: '50%' }}>
                    <Typography variant="h6" color="primary">
                        Parsed result
                    </Typography>
                    <Editor
                        height="80vh"
                        width="100%"
                        language="json"
                        theme="vs-dark"
                        value={parsed}
                        options={{
                            minimap: {
                                enabled: false,
                            },
                            readOnly: true,
                        }}
                    />
                </div>
            </div>
        </ErrorBoundary>
    )
}
