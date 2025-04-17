import { Rs2fEditor } from '../components/Rs2fEditor'
import { useEditorStore } from '../store/editor'

export const EditorPage: React.FC = () => {
    const { contentById, setContent } = useEditorStore()
    return (
        <Rs2fEditor
            selected="editor"
            setEditorContent={setContent}
            setSelected={() => {}}
            filesContent={Object.fromEntries(
                Object.entries(contentById).filter(([k, v]) => {
                    return k === 'editor'
                })
            )}
        />
    )
}
