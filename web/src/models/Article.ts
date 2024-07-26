export type ArticleLang = "ru" | "en"

export type ArticleShort = {
	id: number
	name: string
	lang: ArticleLang
	user_id: number
	url: string
}

export type Article = {
	id: number
	name: string
	term: string
	terminology: string
    author: string
    key_words: string
    publication_year: number
    url: string
    identifier: string
    usage_context: string
    math_apparatus: string
    solving: string
    interests: string
    lang: ArticleLang
}

export type NewArticle = Omit<Article, 'id'>

export type Problem = {
	id: number
	text: string
	is_solved: boolean
}