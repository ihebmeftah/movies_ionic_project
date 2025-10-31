import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Genre {
    id: number;
    name: string;
}

export interface GenresResponse {
    genres: Genre[];
}

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    private apiKey = environment.tmdbApiKey;
    private baseUrl = environment.tmdbBaseUrl;

    constructor(private http: HttpClient) { }

    /**
     * Fetch all movie genres/categories from TMDB API
     * @returns Observable of GenresResponse containing array of genres
     */
    getMovieCategories(): Observable<GenresResponse> {
        const url = `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}`;
        return this.http.get<GenresResponse>(url);
    }
}
