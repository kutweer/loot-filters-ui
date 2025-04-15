import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { SiteConfig } from '../types/SiteConfig'

interface SiteConfigStoreState {
    siteConfig: SiteConfig
    setSiteConfig: (siteConfig: Partial<SiteConfig>) => void
}

export const useSiteConfigStore = create<SiteConfigStoreState>()(
    devtools(
        persist(
            (set) => ({
                siteConfig: {
                    devMode: false,
                    isLocal:
                        window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1',
                },
                setSiteConfig: (siteConfig: Partial<SiteConfig>) =>
                    set((state) => ({
                        siteConfig: {
                            ...state.siteConfig,
                            ...siteConfig,
                        },
                    })),
            }),
            {
                name: 'site-config-store',
                version: 1,
            }
        )
    )
)
