import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface EditorStoreState {
    content: string
    setContent: (content: string) => void
}

export const useEditorStore = create<EditorStoreState>()(
    devtools(
        persist(
            (set) => ({
                content: '',
                setContent: (content) => set({ content }),
            }),
            {
                name: 'editor-content',
                version: 1,
            }
        )
    )
)
