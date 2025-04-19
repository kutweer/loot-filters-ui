import { FormControl } from '@mui/material'
import React, { useCallback } from 'react'
import { useBackgroundStore } from '../store/background'
import { BackgroundImage, backgroundImages } from '../types/Images'
import { Option, UISelect } from './inputs/UISelect'

export const BackgroundSelector: React.FC = () => {
    const backgroundOptions: Option<BackgroundImage>[] = Object.values(
        backgroundImages
    ).map((backgroundImage) => ({
        label: backgroundImage,
        value: backgroundImage,
    }))

    const setActiveBackground = useBackgroundStore(
        (state) => state.updateBackground
    )

    const handleBackgroundChange = useCallback(
        (newValue: Option<BackgroundImage> | null) => {
            if (newValue) {
                setActiveBackground(newValue.value)
            }
        },
        [setActiveBackground]
    )

    const activeBackground = useBackgroundStore((state) => state.background)

    const selectedBackground = activeBackground
        ? {
              label: activeBackground,
              value: activeBackground,
          }
        : null

    return (
        <>
            <FormControl
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                }}
                size="small"
            >
                <UISelect<BackgroundImage>
                    sx={{ width: '250px' }}
                    options={backgroundOptions}
                    value={selectedBackground}
                    onChange={handleBackgroundChange}
                    label="Select a preview background"
                    multiple={false}
                />
            </FormControl>
        </>
    )
}
