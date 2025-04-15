import { Editor } from '@monaco-editor/react'
import { Button, Tab, Tabs, TextField, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { debounce } from 'underscore'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { Input } from '../parsing/FilterTypesSpec'
import { parse, ParseResult } from '../parsing/parse'
import { colors } from '../styles/MuiTheme'
import { useEditorStore } from '../store/editor'

const Pre: React.FC<{
    line: string
}> = ({ line }) => {
    if (line.startsWith('{') && line.startsWith('[')) {
        return (
            <pre
                style={{
                    backgroundColor: colors.rsBlack,
                    color: colors.rsWhite,
                    fontSize: '0.8rem',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                }}
            >
                {JSON.stringify(JSON.parse(line), null, 2)}
            </pre>
        )
    } else {
        return (
            <pre
                style={{
                    backgroundColor: colors.rsBlack,
                    color: colors.rsWhite,
                    whiteSpace: 'pre-wrap',
                }}
            >
                {line}
            </pre>
        )
    }
}

const VisualResults: React.FC<{
    error: Error | null
    parsed: ParseResult | null
}> = ({ error, parsed }) => {
    if (error) {
        return <Pre line={error.toString()} />
    }
    if (!parsed) {
        return <div>No results</div>
    }
    if (parsed.errors) {
        return (
            <div>
                <Typography color="text.primary" variant="h4">
                    {parsed.errors.length} errors found
                </Typography>
                {parsed.errors.map((error) => (
                    <div key={error.error.toString()}>
                        <Typography color="text.secondary" variant="body2">
                            An error was encountered handling the structured
                            comment or #define for:
                        </Typography>
                        <Pre line={error.line} />
                        <Pre line={error.error.toString()} />
                    </div>
                ))}
            </div>
        )
    } else {
        return (
            <div>
                <div>
                    <Typography color="text.primary" variant="h4">
                        {parsed.filter?.name}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                        {parsed.filter?.description}
                    </Typography>
                    {parsed.filter?.modules.map((module) => (
                        <div key={module.name}>
                            <Typography color="text.primary" variant="h6">
                                {module.name}
                            </Typography>
                            <Typography
                                sx={{ marginLeft: '2rem' }}
                                color="text.secondary"
                                variant="body2"
                            >
                                {module.description}
                            </Typography>
                            {module.inputs.map((input: Input) => (
                                <div key={input.label + input.type}>
                                    <Typography
                                        sx={{ marginLeft: '2rem' }}
                                        component="span"
                                        color="text.primary"
                                        variant="body2"
                                    >
                                        <span
                                            style={{ color: colors.rsYellow }}
                                        >
                                            {input.type}
                                        </span>{' '}
                                        ({input.group ?? 'No Group'}){' '}
                                        <span
                                            style={{
                                                color: colors.rsLightestBrown,
                                            }}
                                        >
                                            {input.label}
                                        </span>
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export const EditorPage = () => {
    const { content: editorContent, setContent: setEditorContent } =
        useEditorStore()
    const [error, setError] = useState<Error | null>(null)

    const [tab, setTab] = useState<'visual' | 'json' | 'none'>('visual')

    const [url, setUrl] = useState('')

    const [parsed, setParsed] = useState<ParseResult | null>(null)

    const debouncedParse = useCallback(
        debounce(async (content: string) => {
            try {
                setError(null)
                const parsed = await parse(content)
                setParsed(parsed)
            } catch (e) {
                setError(e as Error)
            }
        }, 100),
        [setError, setParsed]
    )

    useEffect(() => {
        debouncedParse(editorContent)
    }, [editorContent])

    useEffect(() => {
        if (!editorContent) {
            fetch(url)
                .then((res) => res.text())
                .then((content) => {
                    setEditorContent(content)
                })
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
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1rem',
                    marginBottom: '1rem',
                }}
            >
                <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
                    <Tab value="visual" label="Visual Results" />
                    <Tab value="json" label="Result JSON" />
                    <Tab value="none" label="No Results" />
                </Tabs>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                <div
                    style={{
                        width: tab === 'none' ? '100%' : '50%',
                        minHeight: '75vh',
                    }}
                >
                    <Editor
                        height="100%"
                        width="100%"
                        language="cpp"
                        theme="vs-dark"
                        options={{
                            minimap: {
                                enabled: false,
                            },
                            wordWrap: 'on',
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
                <div
                    style={{
                        width: '50%',
                        display: tab === 'visual' ? 'block' : 'none',
                    }}
                >
                    <VisualResults error={error} parsed={parsed} />
                </div>
                <div
                    style={{
                        width: '50%',
                        display: tab === 'json' ? 'block' : 'none',
                    }}
                >
                    <Editor
                        height="80vh"
                        width="100%"
                        language="json"
                        theme="vs-dark"
                        value={JSON.stringify(parsed, null, 2)}
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
