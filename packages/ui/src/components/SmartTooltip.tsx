import { Tooltip } from '@mui/material'

export const SmartTooltip = ({
    enabledTitle,
    disabledTitle,
    tooltipSide = 'top',
    enabled,
    children,
}: {
    enabledTitle: string
    disabledTitle: string
    enabled: boolean
    children: React.ReactNode
    tooltipSide?: 'top' | 'bottom' | 'left' | 'right'
}) => {
    return (
        <Tooltip
            title={enabled ? enabledTitle : disabledTitle}
            placement={tooltipSide}
        >
            {/* span is required to prevent tooltip from being disabled when input is disabled */}
            <span>{children}</span>
        </Tooltip>
    )
}
