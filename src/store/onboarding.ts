import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface OnboardingStoreState {
    onboardingComplete: boolean
    setOnboardingComplete: (onboardingComplete: boolean) => void
}

export const useOboardingStore = create<OnboardingStoreState>()(
    devtools(
        persist(
            (set) => ({
                onboardingComplete: false,
                setOnboardingComplete: (onboardingComplete) =>
                    set((state) => ({ onboardingComplete })),
            }),
            {
                name: 'onboarding-complete',
                version: 1,
            }
        )
    )
)
