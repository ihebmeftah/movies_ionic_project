import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private apiKey = environment.tmdbApiKey;
  private baseUrl = environment.tmdbBaseUrl;
  private imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  constructor(private http: HttpClient) { }

  /**
   * Fetch top-rated movies from TMDB API
   * @param page Page number (default: 1)
   * @returns Observable of MoviesResponse containing array of movies
   */
  getTopRatedMovies(page: number = 1): Observable<MoviesResponse> {
    const url = `${this.baseUrl}/movie/top_rated?api_key=${this.apiKey}&page=${page}`;
    return this.http.get<MoviesResponse>(url);
  }

  /**
   * Fetch trending movies from TMDB API
   * @param page Page number (default: 1)
   * @returns Observable of MoviesResponse containing array of trending movies
   */
  getTrendingMovies(page: number = 1): Observable<MoviesResponse> {
    const url = `${this.baseUrl}/trending/movie/week?api_key=${this.apiKey}&page=${page}`;
    return this.http.get<MoviesResponse>(url);
  }

  /**
   * Fetch upcoming movies from TMDB API
   * @param page Page number (default: 1)
   * @returns Observable of MoviesResponse containing array of upcoming movies
   */
  getUpcomingMovies(page: number = 1): Observable<MoviesResponse> {
    const url = `${this.baseUrl}/movie/upcoming?api_key=${this.apiKey}&page=${page}`;
    return this.http.get<MoviesResponse>(url);
  }

  /**
   * Get the full poster URL for a movie
   * @param posterPath The poster path from the API
   * @returns Full URL to the poster image
   */
  getPosterUrl(posterPath: string): string {
    return posterPath ? `${this.imageBaseUrl}${posterPath}` : '';
  }

  /**
   * Get the full backdrop URL for a movie
   * @param backdropPath The backdrop path from the API
   * @returns Full URL to the backdrop image
   */
  getBackdropUrl(backdropPath: string): string {
    return backdropPath ? `${this.imageBaseUrl}${backdropPath}` : '';
  }
}
