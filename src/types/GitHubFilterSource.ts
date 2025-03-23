export type GitHubFilterSource = {
    owner: string
    repo: string
    branch: string
    filterPath: string
    updateMeta?: {
        sha: string
        updatedAt: string
    }
}

export type GitHubMeta = {
    sha: string
    commit: {
        author: {
            // ISO 8601
            date: string
        }
    }
}

export const currentGhMeta = async (
    source: GitHubFilterSource
): Promise<GitHubMeta> => {
    const response = await fetch(
        `https://api.github.com/repos/${source.owner}/${source.repo}/commits/${source.branch}`
    )
    const data = await response.json()
    return data
}

export const buildFilterUrl = async (
    source: GitHubFilterSource
): Promise<string> => {
    const meta = await currentGhMeta(source)
    return `https://raw.githubusercontent.com/${source.owner}/${source.repo}/${meta.sha}/${source.filterPath}`
}
