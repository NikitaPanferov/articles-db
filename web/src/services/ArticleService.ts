import $api from '../api'
import { AxiosResponse } from 'axios'
import { ArticlesResponse, ArticleUpdateResponse, NewProblemResponse } from '../models/response/ArticleResponse'
import { ArticleDetailResponse } from '../models/response/ArticleResponse'
import { ArticleLang, NewArticle }from '../models/Article'

export default class ArticleService {
    static async create(article: NewArticle): Promise<AxiosResponse<{id: number}>> {
        return $api.post('api/articles', { ...article })
    }

    static async get(articleId: string): Promise<AxiosResponse<ArticleDetailResponse>> {
        return $api.get(`api/articles/${articleId}`)
    }

    static async createNewProblem(articleId: number, problemText: string): Promise<AxiosResponse<NewProblemResponse>> {
        return $api.post(`api/articles/${articleId}/`, {problem: problemText})
    }

    static async getArticles(searchString: string): Promise<AxiosResponse<ArticlesResponse>> {
        const url = '/api/articles' + (!!searchString ? `?${searchString}` : "")
        return $api.get(url)
    }

    static async getMyArticles(): Promise<AxiosResponse<ArticlesResponse>> {
        return $api.get('/api/articles/my')
    }

    static async getTermsByLang(lang: ArticleLang): Promise<AxiosResponse<string[]>> {
        return $api.get(`api/articles/terms?lang=${lang}`)
    }

    static async updateArticle(articleId: number, article: ArticleUpdateResponse): Promise<AxiosResponse<ArticleDetailResponse>> {
        return $api.put(`api/articles/${articleId}`, {...article})
    }
}