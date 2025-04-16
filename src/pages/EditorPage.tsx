import { useState } from 'react'
import { Rs2fEditor } from '../components/Rs2fEditor'
import { useEditorStore } from '../store/editor'

export const EditorPage: React.FC = () => {
    const { contentById, setContent } = useEditorStore()
    const [selected, setSelected] = useState<string | null>(null)

    return (
        <Rs2fEditor
            selected="editor"
            setEditorContent={setContent}
            setSelected={setSelected}
            filesContent={Object.fromEntries(
                Object.entries(contentById).filter(([k, v]) => {
                    return k === 'editor'
                })
            )}
        />
    )
}
