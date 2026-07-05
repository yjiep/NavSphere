import { auth } from '@/lib/auth'
import { stringToBase64 } from '@/lib/buffer-utils'

export async function getFileContent(path: string) {
  const owner = process.env.GITHUB_OWNER!
  const repo = process.env.GITHUB_REPO!
  const branch = process.env.GITHUB_BRANCH || 'main'

  try {
    const session = await auth()
    const token = session?.user?.accessToken || process.env.GITHUB_PAT

    const apiUrl = https://api.github.com/repos///contents/?ref=
    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/vnd.github.v3.raw',
        Authorization: token ? 	oken  : '',
        'User-Agent': 'NavSphere',
      },
    })

    if (response.status === 404) {
      console.log(File not found: , returning default data)
      if (path.includes('navigation.json')) {
        return { navigationItems: [] }
      }
      return {}
    }

    if (!response.ok) {
      throw new Error(GitHub API error: )
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching file:', error)
    if (path.includes('navigation.json')) {
      return { navigationItems: [] }
    }
    return {}
  }
}

export async function commitFile(
  path: string,
  content: string,
  message: string,
  token: string,
  retryCount = 3
) {
  const owner = process.env.GITHUB_OWNER!
  const repo = process.env.GITHUB_REPO!
  const branch = process.env.GITHUB_BRANCH || 'main'

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      const currentFileUrl = https://api.github.com/repos///contents/?ref=
      const currentFileResponse = await fetch(currentFileUrl, {
        headers: {
          Authorization: 	oken ,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'NavSphere',
        },
        cache: 'no-store',
      })

      let sha = undefined
      if (currentFileResponse.ok) {
        const currentFile = await currentFileResponse.json()
        sha = currentFile.sha
      }

      const updateUrl = https://api.github.com/repos///contents/
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          Authorization: 	oken ,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'NavSphere',
        },
        body: JSON.stringify({
          message,
          content: stringToBase64(content),
          sha,
          branch,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        if (attempt < retryCount && error.message?.includes('sha')) {
          console.log(Attempt  failed, retrying after delay...)
          await delay(1000 * attempt)
          continue
        }
        throw new Error(Failed to commit file: )
      }

      return await response.json()
    } catch (error) {
      if (attempt === retryCount) {
        console.error('Error in commitFile:', error)
        throw error
      }
      console.log(Attempt  failed, retrying...)
      await delay(1000 * attempt)
    }
  }
}