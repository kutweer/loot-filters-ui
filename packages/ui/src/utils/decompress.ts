export async function decompressGzip(compressed: ArrayBuffer): Promise<string> {
    const decompressionStream = new DecompressionStream('gzip')
    const decompressedStream = new Response(compressed).body?.pipeThrough(
        decompressionStream
    )
    if (!decompressedStream) {
        throw new Error('Failed to create decompression stream')
    }
    const decompressed = await new Response(decompressedStream).text()
    return decompressed
}

export async function loadGzippedJson<T>(url: string): Promise<T> {
    const response = await fetch(url)
    const compressed = await response.arrayBuffer()
    const decompressed = await decompressGzip(compressed)
    return JSON.parse(decompressed)
}
