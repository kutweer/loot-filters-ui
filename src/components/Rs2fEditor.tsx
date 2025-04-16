import { Editor } from '@monaco-editor/react'
import { Tab, Tabs, Typography } from '@mui/material'
import { useState } from 'react'
import { parse, ParseResult } from '../parsing/parse'
import { colors } from '../styles/MuiTheme'
import { ErrorBoundary } from './ErrorBoundary'
import { UISelect } from './inputs/UISelect'
import { CustomizeTab } from './tabs/CustomizeTab'

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

const causeList = (error: Error): Error[] => {
    const causes: Error[] = []
    let current: Error | null | undefined = error?.cause as
        | Error
        | null
        | undefined
    while (current) {
        causes.push(current)
        current = current.cause as Error | null
    }
    return causes
}

const VisualResults: React.FC<{
    parsed: ParseResult | null
}> = ({ parsed }) => {
    if (!parsed) {
        return <div>No parsed result</div>
    }
    if (parsed.errors) {
        return (
            <div>
                <Typography color="text.primary" variant="h4">
                    {parsed.errors.length} errors found
                </Typography>
                {parsed.errors.map((error, i) => (
                    <div key={i}>
                        <Typography color="text.secondary" variant="body2">
                            An error was encountered handling the structured
                            comment or #define for:
                        </Typography>
                        <Pre line={error.line} />
                        <Pre line={error.error.toString()} />
                        {causeList(error.error as Error).map((cause, i) => (
                            <div key={i}>
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                >
                                    Caused By:
                                </Typography>
                                <Pre line={cause.toString()} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        )
    } else {
        return (
            <CustomizeTab
                filter={parsed.filter!!}
                config={{
                    enabledModules: {},
                    inputConfigs: {},
                }}
                readonly={true}
                onChange={() => {}}
                clearConfiguration={() => {}}
                setEnabledModule={() => {}}
            />
        )
    }
}

export const Rs2fEditor: React.FC<{
    selected: string | null
    setSelected: (selected: string | null) => void

    filesContent: Record<string, string>
    setEditorContent: (id: string, content: string) => void
}> = ({ selected, setSelected, filesContent, setEditorContent }) => {
    const selectedContent = selected ? filesContent[selected] || '' : ''

    const parsed =
        typeof selectedContent === 'string' ? parse(selectedContent) : null

    const [tab, setTab] = useState<'visual' | 'json' | 'wide'>('visual')

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
                <UISelect<string>
                    options={Object.keys(filesContent).map((file) => ({
                        label: file,
                        value: file,
                    }))}
                    value={
                        selected ? { label: selected, value: selected } : null
                    }
                    onChange={(value) => {
                        if (!value) {
                            setSelected(null)
                        } else {
                            setSelected(value.value)
                        }
                    }}
                    label="choose a file"
                    multiple={false}
                    freeSolo={false}
                    disabled={false}
                    error={false}
                />
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
                    <Tab value="wide" label="Wide Editor" />
                </Tabs>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                <div
                    style={{
                        width: tab === 'wide' ? '100%' : '50%',
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
                                // VERY laggy on large filters
                                enabled: false,
                            },
                            wordWrap: 'on',
                            readOnly: !selected,
                        }}
                        value={selectedContent}
                        onChange={(content) => {
                            if (selected) {
                                setEditorContent(selected, content ?? '')
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
                    <VisualResults parsed={parsed} />
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
