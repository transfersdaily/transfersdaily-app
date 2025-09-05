'use client'

interface Article {
  id: string
  title: string
  content: string
  slug: string
}

interface ArticleClientComponentsProps {
  article: Article
  locale: string
  dict: any
}

export function ArticleClientComponents({ article, locale, dict }: ArticleClientComponentsProps) {
  return null
}
