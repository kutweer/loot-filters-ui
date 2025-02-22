import React, { useEffect, useRef } from "react";
import { LootGroup } from "../types/FilterTypes";
import { argbToRgba } from "../types/hexcolor";
import './ItemTextRender.css';
interface ItemTextRenderProps {
    lootGroup: Omit<LootGroup, "uniqueOverrides">;
}

export const ItemTextRender: React.FC<ItemTextRenderProps> = ({ lootGroup }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const foregroundColor = argbToRgba(lootGroup.foregroundColor);
    const backgroundColor = argbToRgba(lootGroup.backgroundColor);
    const borderColor = argbToRgba(lootGroup.borderColor);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !lootGroup) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set default styles
        const fontSize = 16;
        ctx.font = `${fontSize} RuneScape`;
        ctx.imageSmoothingEnabled = false;

        // Get size
        const text = "Abyssal Whip";
        const textSize = ctx.measureText(text);

        // Define Text background box
        const padding = 4;
        const boxWidth = textSize.width + (padding * 2);
        const boxHeight = fontSize + (padding * 2);
        const [boxX, boxY] = [canvas.width / 2 - boxWidth / 2, canvas.height / 2 - boxHeight / 2]

        // Draw background box
        if (lootGroup.backgroundColor) {
            ctx.fillStyle = backgroundColor
            ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        }

        // Draw border if specified
        if (lootGroup.borderColor) {
            ctx.strokeStyle = borderColor
            ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        }

        // Draw text
        ctx.fillStyle = foregroundColor
        ctx.fillText(text, boxX + 4, boxY + fontSize + 2);

    }, [lootGroup]);

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={100}
                height={48}
                style={{
                    backgroundColor: "lightgrey",
                    border: "1px solid #000",
                }}
            />
        </div>
    );
};
