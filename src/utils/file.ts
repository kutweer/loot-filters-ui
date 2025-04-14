export const downloadFile = (file: File) => {
    const link = document.createElement('a')

    try {
        const href = URL.createObjectURL(file)
        link.setAttribute('href', href)
        link.setAttribute('download', file.name)
        document.body.appendChild(link)
        link.click()
    } catch (error) {
        console.error(`Failed to download file: ${file.name}`, error)
    } finally {
        document.body.removeChild(link)
    }
}

const keys = [
    'background-image-selected',
    'filter-store',
    'modular-filter-storage',
    'filter-configuration-store',
    'modular-filter-storage-migrated',
]
export const localState = () => {
    return Object.fromEntries(
        keys.map((key) => {
            return [key, localStorage.getItem(key) ?? null]
        })
    )
}
