import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface EditorStoreState {
    contentById: Record<string, string>
    setContent: (id: string, content: string) => void
}

export const useEditorStore = create<EditorStoreState>()(
    devtools(
        persist(
            (set) => ({
                contentById: {},
                setContent: (id, content) =>
                    set((state) => {
                        return {
                            ...state,
                            contentById: {
                                ...state.contentById,
                                [id]: content,
                            },
                        }
                    }),
            }),
            {
                name: 'editor-content',
                version: 1,
            }
        )
    )
)
