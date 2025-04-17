import { FormControl, Popover, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import { RgbaColorPicker } from 'react-colorful'
import { isNumber } from 'underscore'
import { ArgbHexColorSpec } from '../../parsing/UiTypesSpec'
import {
    ArgbHexColor,
    argbHexColorToRGBColor,
    colorHexToRgbaCss,
} from '../../utils/Color'

type RGBColor = {
    a: number
    r: number
    g: number
    b: number
}

const rGBColorToArgbHex = (color: RGBColor): ArgbHexColor => {
    let alpha = color.a
    if (isNumber(alpha) && (!Number.isInteger(alpha) || alpha === 1)) {
        alpha = Math.round(alpha * 255)
    }

    return `#${alpha?.toString(16).padStart(2, '0') || '00'}${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`
}

const Swatch: React.FC<{
    color: ArgbHexColor | undefined
}> = ({ color }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)

    React.useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Create checkerboard pattern
        const size = 5
        for (let x = 0; x < canvas.width; x += size) {
            for (let y = 0; y < canvas.height; y += size) {
                ctx.fillStyle = ((x + y) / size) % 2 ? '#000000' : '#FF00FF'
                ctx.fillRect(x, y, size, size)
            }
        }

        // Draw the actual color on top if set
        if (color !== '#00000000') {
            const rgba = colorHexToRgbaCss(color)
            if (rgba) {
                ctx.fillStyle = rgba
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            }
        }
    }, [color])

    return (
        <canvas
            ref={canvasRef}
            width={40}
            height={20}
            style={{
                borderRadius: '4px',
                border: '1px solid #564e43',
            }}
        />
    )
}

const ColorPicker: React.FC<{
    color?: ArgbHexColor
    onChange: (color: ArgbHexColor | undefined) => void
    labelText: string
    labelLocation: 'right' | 'bottom'
    disabled: boolean
}> = ({ color, onChange, labelText, labelLocation, disabled }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
    const open = Boolean(anchorEl)

    const colorOrError = ArgbHexColorSpec.safeParse(color)

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!disabled) {
            setAnchorEl(event.currentTarget)
        }
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleChange = (newColor: RGBColor) => {
        const argbColor = rGBColorToArgbHex(newColor)
        setInputTextState(argbColor)
        onChange(argbColor)
        setInputTextState(argbColor)
    }

    const [inputTextState, setInputTextState] = useState<string>(
        colorOrError.success ? colorOrError.data!! : '#FF000000'
    )

    const handleHexChange = (newColor: string) => {
        const newColorOrError = ArgbHexColorSpec.safeParse(newColor)

        if (newColorOrError.success) {
            setInputTextState(newColorOrError.data!!)
            onChange(newColorOrError.data)
        }
    }

    const unset = color === undefined || color === '00000000'

    return (
        <div>
            <div>
                <div
                    style={
                        labelLocation == 'right'
                            ? { display: 'flex', gap: 2 }
                            : {}
                    }
                >
                    <Tooltip
                        title={
                            disabled
                                ? 'Color picker is disabled'
                                : !unset
                                  ? 'Shift + Click to revert to default color'
                                  : 'Click to pick a color'
                        }
                    >
                        <div
                            style={{
                                padding: '5px',
                                display: 'inline-block',
                                cursor: disabled ? 'not-allowed' : 'pointer',
                            }}
                            onClick={(e) => {
                                if (e.shiftKey) {
                                    onChange(undefined)
                                    setAnchorEl(null)
                                } else {
                                    handleClick(e)
                                }
                            }}
                        >
                            <Swatch color={color} />
                        </div>
                    </Tooltip>
                    <Typography
                        style={{
                            fontFamily: 'RuneScape',
                            textAlign: 'left',
                            marginLeft:
                                labelLocation == 'right' ? '10px' : '0px',
                        }}
                        color={disabled ? '#cccccc' : 'inherit'}
                    >
                        {labelText}
                    </Typography>
                </div>
            </div>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <div
                    style={{
                        backgroundColor: '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                    }}
                >
                    <RgbaColorPicker
                        color={
                            colorOrError.success
                                ? argbHexColorToRGBColor(color)
                                : {
                                      r: 0,
                                      g: 0,
                                      b: 0,
                                      a: 1,
                                  }
                        }
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        value={inputTextState}
                        style={{ fontFamily: 'monospace' }}
                        onChange={(e) => handleHexChange(e.target.value)}
                    />
                    <div style={{ fontSize: '12px', color: '#000' }}>
                        <span style={{ fontFamily: 'monospace' }}>
                            #AARRGGBB
                        </span>
                    </div>
                    <div>
                        <Typography fontSize="12px" color="red">
                            {colorOrError.error?.message}
                        </Typography>
                    </div>
                </div>
            </Popover>
        </div>
    )
}

const ColorPickerInput: React.FC<{
    color?: ArgbHexColor
    labelText: string
    onChange: (color: ArgbHexColor | undefined) => void
    labelLocation?: 'right' | 'bottom'
    disabled?: boolean
    helpText?: string
}> = ({ color, onChange, labelText, labelLocation, disabled, helpText }) => {
    const labelLocationValue = labelLocation ?? 'bottom'
    return (
        <FormControl sx={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <ColorPicker
                labelLocation={labelLocationValue}
                labelText={labelText}
                color={color}
                onChange={onChange}
                disabled={disabled || false}
            />
            {helpText && (
                <Typography
                    sx={{
                        color: '#ff0000',
                        fontFamily: 'RuneScape',
                        fontSize: '20px',
                        marginTop: '2px',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {helpText}
                </Typography>
            )}
        </FormControl>
    )
}

export { ColorPicker, ColorPickerInput }
