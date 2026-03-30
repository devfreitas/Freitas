import { useEffect, useState } from 'react'

export interface GitHubData {
  languages: { name: string; pct: number; color: string }[]
  stats: {
    stars: number
    commits: number
    prs: number
    issues: number
    contributed: number
  }
  contributions: number[][] // [week][day] 0-4 intensity
}

// GitHub's language colors (subset)
const LANG_COLORS: Record<string, string> = {
  TypeScript:  '#3178c6',
  JavaScript:  '#f1e05a',
  Python:      '#3572A5',
  HTML:        '#e34c26',
  CSS:         '#563d7c',
  Shell:       '#89e051',
  Rust:        '#dea584',
  Go:          '#00ADD8',
  Java:        '#b07219',
  'C#':        '#178600',
  'C++':       '#f34b7d',
  Vue:         '#41b883',
  Svelte:      '#ff3e00',
  Kotlin:      '#A97BFF',
  Swift:       '#F05138',
  Ruby:        '#701516',
  PHP:         '#4F5D95',
  Dart:        '#00B4AB',
}

// Tokens
const USERNAME = import.meta.env.VITE_GITHUB_USERNAME as string
const TOKEN    = (import.meta.env.VITE_GITHUB_TOKEN ?? '') as string

const authHeaders = (): HeadersInit =>
  TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}

async function fetchLanguages(): Promise<{ name: string; pct: number; color: string }[]> {
  // Get all repositories
  const res = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100&type=owner`,
    { headers: authHeaders() }
  )
  const repos: { name: string; fork: boolean }[] = await res.json()
  const owned = repos.filter(r => !r.fork)

  // Fetch language bytes for each repo in parallel
  const results = await Promise.all(
    owned.map(r =>
      fetch(`https://api.github.com/repos/${USERNAME}/${r.name}/languages`, {
        headers: authHeaders(),
      }).then(r => r.json() as Promise<Record<string, number>>)
    )
  )

  // Aggregate
  const totals: Record<string, number> = {}
  for (const langs of results) {
    for (const [lang, bytes] of Object.entries(langs)) {
      totals[lang] = (totals[lang] ?? 0) + bytes
    }
  }

  const total = Object.values(totals).reduce((a, b) => a + b, 0)
  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, bytes]) => ({
      name,
      pct: Math.round((bytes / total) * 1000) / 10,
      color: LANG_COLORS[name] ?? '#8b8b8b',
    }))
}

async function fetchStats(): Promise<GitHubData['stats']> {
  const headers = authHeaders()

  const [userRes, reposRes, prsRes, issuesRes, eventsRes] = await Promise.all([
    fetch(`https://api.github.com/users/${USERNAME}`, { headers }),
    fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&type=owner`, { headers }),
    fetch(`https://api.github.com/search/issues?q=author:${USERNAME}+type:pr&per_page=1`, { headers }),
    fetch(`https://api.github.com/search/issues?q=author:${USERNAME}+type:issue&per_page=1`, { headers }),
    fetch(`https://api.github.com/users/${USERNAME}/events?per_page=100`, { headers }),
  ])

  const user   = await userRes.json()
  const repos: { stargazers_count: number }[] = await reposRes.json()
  const prs    = await prsRes.json()
  const issues = await issuesRes.json()
  const events: { type: string; created_at: string }[] = await eventsRes.json()

  const stars = repos.reduce((acc, r) => acc + (r.stargazers_count ?? 0), 0)

  // Count push events in the last year as commit proxy
  const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000
  const commits = events.filter(
    e => e.type === 'PushEvent' && new Date(e.created_at).getTime() > oneYearAgo
  ).length * 3 // rough multiplier (events are paginated to 100)

  return {
    stars,
    commits,
    prs:         prs.total_count   ?? 0,
    issues:      issues.total_count ?? 0,
    contributed: user.public_repos  ?? 0,
  }
}

async function fetchContributions(): Promise<number[][]> {
  if (!TOKEN) return []

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
              }
            }
          }
        }
      }
    }
  `

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { login: USERNAME } }),
  })

  const json = await res.json()
  const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? []

  return weeks.map((w: { contributionDays: { contributionCount: number }[] }) => {
    const max = 10
    return w.contributionDays.map(d => {
      const c = d.contributionCount
      if (c === 0) return 0
      if (c <= 2)  return 1
      if (c <= max * 0.3) return 2
      if (c <= max * 0.6) return 3
      return 4
    })
  })
}

export function useGitHub() {
  const [data, setData]       = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!USERNAME) {
      setError('VITE_GITHUB_USERNAME not set')
      setLoading(false)
      return
    }

    Promise.all([fetchLanguages(), fetchStats(), fetchContributions()])
      .then(([languages, stats, contributions]) => {
        setData({ languages, stats, contributions })
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}
