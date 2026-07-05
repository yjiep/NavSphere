'use client'

import { useState, useMemo } from 'react'
import type { NavigationData, NavigationItem, NavigationSubItem } from '@/types/navigation'
import type { SiteConfig } from '@/types/site'
import { NavigationCard } from '@/components/navigation-card'
import { Sidebar } from '@/components/sidebar'
import { SearchBar } from '@/components/search-bar'
import { ModeToggle } from '@/components/mode-toggle'
import { Footer } from '@/components/footer'
import { Github, HelpCircle, Puzzle, MonitorPlay, Send, Database, Cloud } from 'lucide-react'
import { Button } from "@/registry/new-york/ui/button"
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'

interface NavigationContentProps {
  liveData: { navigationData: NavigationData; siteData: SiteConfig }
  fallbackData: { navigationData: NavigationData; siteData: SiteConfig }
}

export function NavigationContent({ liveData, fallbackData }: NavigationContentProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [useFallback, setUseFallback] = useState(false)

  const { navigationData, siteData } = useFallback ? fallbackData : liveData

  const searchResults = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return []

    const results: Array<{
      category: NavigationItem
      items: (NavigationItem | NavigationSubItem)[]
      subCategories: Array<{
        title: string
        items: (NavigationItem | NavigationSubItem)[]
      }>
    }> = []

    navigationData.navigationItems.forEach(category => {
      const items = (category.items || []).filter(item => {
        if (item.enabled === false) return false
        const titleMatch = item.title.toLowerCase().includes(query)
        const descMatch = item.description?.toLowerCase().includes(query)
        return titleMatch || descMatch
      })

      const subResults: Array<{
        title: string
        items: (NavigationItem | NavigationSubItem)[]
      }> = []

      if (category.subCategories) {
        category.subCategories.forEach(sub => {
          if (sub.enabled === false) return
          const subItems = (sub.items || []).filter(item => {
            if (item.enabled === false) return false
            const titleMatch = item.title.toLowerCase().includes(query)
            const descMatch = item.description?.toLowerCase().includes(query)
            return titleMatch || descMatch
          })

          if (subItems.length > 0) {
            subResults.push({
              title: sub.title,
              items: subItems
            })
          }
        })
      }

      if (items.length > 0 || subResults.length > 0) {
        results.push({
          category,
          items,
          subCategories: subResults
        })
      }
    })

    return results
  }, [navigationData, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      <div className="hidden sm:block">
        <Sidebar
          navigationData={navigationData}
          siteInfo={siteData}
          className="sticky top-0 h-screen"
        />
      </div>

      <div className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all sm:hidden",
        isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className={cn(
          "fixed inset-y-0 right-0 sm:left-0 w-3/4 max-w-xs bg-background shadow-lg transform transition-transform duration-200 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "translate-x-full sm:-translate-x-full"
        )}>
          <Sidebar
            navigationData={navigationData}
            siteInfo={siteData}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>
      </div>

      <main className="flex-1">
        <div className="sticky top-0 bg-background/90 backdrop-blur-sm z-30 px-3 sm:px-6 py-2">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SearchBar
                navigationData={navigationData}
                onSearch={handleSearch}
                searchResults={searchResults}
                searchQuery={searchQuery}
                siteConfig={siteData}
              />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setUseFallback(!useFallback)}
                className={cn(
                  "hover:bg-accent hover:text-accent-foreground",
                  useFallback && "text-primary bg-accent"
                )}
                title={useFallback ? "\u5F53\u524D\uFF1A\u9759\u6001\u6570\u636E\uFF08\u70B9\u51FB\u5207\u6362\u5230\u5B9E\u65F6\uFF09" : "\u5F53\u524D\uFF1A\u5B9E\u65F6\u6570\u636E\uFF08\u70B9\u51FB\u5207\u6362\u5230\u9759\u6001\uFF09"}
              >
                {useFallback ? <Database className="h-5 w-5" /> : <Cloud className="h-5 w-5" />}
              </Button>
              <Link
                href="/submit"
                aria-label="投稿网站"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </Link>
              <Link
                href="/videos"
                aria-label="Video Navigation"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  <MonitorPlay className="h-5 w-5" />
                </Button>
              </Link>
              <ModeToggle />
              <Link
                href="https://github.com/tianyaxiang/NavSphere"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="访问 GitHub 仓库"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  <Github className="h-5 w-5" />
                </Button>
              </Link>
              <Link
                href="https://github.com/tianyaxiang/navsphere-extension"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="下载浏览器插件"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  <Puzzle className="h-5 w-5" />
                </Button>
              </Link>
              <Link
                href="https://mp.weixin.qq.com/s/XBeedyqHGJtaAa_v9EXz4A"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="查看帮助文档"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-6 py-3 sm:py-6">
          <div className="space-y-6">
            {navigationData.navigationItems.map((category) => (
              <section key={category.id} id={category.id} className="scroll-m-16">
                <div className="space-y-4">
                  <h2 className="text-base font-medium tracking-tight">
                    {category.title}
                  </h2>

                  {category.items && category.items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {category.items.map((item) => (
                        <NavigationCard key={item.id} item={item} siteConfig={siteData} />
                      ))}
                    </div>
                  )}

                  {category.subCategories && category.subCategories.length > 0 &&
                    category.subCategories.map((subCategory) => (
                      <div key={subCategory.id} id={subCategory.id} className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          {subCategory.title}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {(subCategory.items || []).map((item) => (
                            <NavigationCard key={item.id} item={item} siteConfig={siteData} />
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <Footer siteInfo={siteData} />
      </main>
    </div>
  )
}
