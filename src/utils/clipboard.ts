/**
 * Copies the provided text to the user's clipboard
 */
export const copyToClipboard = async (text: string): Promise<void> => {
    try {
        await navigator.clipboard.writeText(text)
    } catch (err) {
        console.error('Failed to copy text to clipboard:', err)
        throw new Error('Failed to copy to clipboard')
    }
}
