import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Input } from '../parsing/UiTypesSpec'

interface SettingsCopyStoreState {
    copiedInput: Input | null
    pasteableConfig: any | null
    setSettingsCopy: (input: Input, settings: any) => void
    clearSettingsCopy: () => void
}
export const useSettingsCopyStore = create<SettingsCopyStoreState>()(
    devtools((set) => ({
        copiedInput: null,
        pasteableConfig: null,
        setSettingsCopy: (inputFrom, inputConfig) =>
            set({ copiedInput: inputFrom, pasteableConfig: inputConfig }),
        clearSettingsCopy: () =>
            set({ copiedInput: null, pasteableConfig: null }),
    }))
)
