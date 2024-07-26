import { Article, ArticleShort, Problem } from "../Article";

export type ArticlesResponse = ArticleShort[]

export type ArticleDetailResponse = Article & {
	user_id: number
	problems: Problem[]
}

export type ArticleUpdateResponse = Omit<Article, 'id' | 'lang' | 'publication_year'> & {
	problems: Problem[]
}

export type NewProblemResponse = Problem