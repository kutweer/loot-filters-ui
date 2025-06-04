import { create } from "zustand"
import { persist, devtools } from "zustand/middleware"


export interface FeatureFlaggedStore {
    themes: boolean
    checkFeatureFlag: (featureFlag: string) => boolean
}

export const FeatureFlaggedStore = create<FeatureFlaggedStore>()(
    devtools(
        persist(
            (_, get) => ({
                themes: false,
                checkFeatureFlag: (featureFlag: string) => {
                    if (featureFlag === 'themes') {
                        return get().themes
                    }
                    return false
                },
            }),
            {
                name: 'feature-flags',
                version: 1,
            }
        )
    )
)

export const FeatureFlagged: React.FC<{
    featureFlag: string,
    children: React.ReactNode
}> = ({ featureFlag, children }) => {
    const isEnabled = FeatureFlaggedStore.getState().checkFeatureFlag(featureFlag)

    if (!isEnabled) {
        return null
    }

    return <>{children}</>
}