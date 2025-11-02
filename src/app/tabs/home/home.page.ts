import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MoviesService, Movie as TMDBMovie } from '../../services/movies.service';
import { FavoritesService } from '../../services/favorites.service';

interface Category {
  name: string;
  icon: string;
  active: boolean;
}

interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  genre: string;
  year: number;
  releaseDate?: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  searchQuery: string = '';

  categories: Category[] = [
    { name: 'All', icon: 'apps', active: true },
    { name: 'Action', icon: 'flame', active: false },
    { name: 'Comedy', icon: 'happy', active: false },
    { name: 'Drama', icon: 'sad', active: false },
    { name: 'Horror', icon: 'skull', active: false },
    { name: 'Sci-Fi', icon: 'rocket', active: false },
  ];

  topMovies: Movie[] = [];
  trendingMovies: Movie[] = [];
  upcomingMovies: Movie[] = [];

  constructor(
    private router: Router,
    private moviesService: MoviesService,
    private favoritesService: FavoritesService
  ) { }

  ngOnInit() {
    this.loadTopRatedMovies();
    this.loadTrendingMovies();
    this.loadUpcomingMovies();

    // Subscribe to favorites changes to update UI
    this.favoritesService.favorites$.subscribe(() => {
      this.updateFavoriteStatus();
    });
  }

  /**
   * Update favorite status for all movies
   */
  private updateFavoriteStatus() {
    this.topMovies.forEach(movie => {
      movie.isFavorite = this.favoritesService.isFavorite(movie.id);
    });
    this.trendingMovies.forEach(movie => {
      movie.isFavorite = this.favoritesService.isFavorite(movie.id);
    });
    this.upcomingMovies.forEach(movie => {
      movie.isFavorite = this.favoritesService.isFavorite(movie.id);
    });
  }

  /**
   * Load top-rated movies from TMDB API
   */
  private loadTopRatedMovies() {
    this.moviesService.getTopRatedMovies(1).subscribe({
      next: (response) => {
        console.log('Top-rated movies loaded:', response.results);

        // Map TMDB movies to local Movie interface
        this.topMovies = response.results.slice(0, 10).map(movie => ({
          id: movie.id,
          title: movie.title,
          poster: this.moviesService.getPosterUrl(movie.poster_path),
          rating: parseFloat(movie.vote_average.toFixed(1)),
          genre: this.getGenreFromIds(movie.genre_ids),
          year: new Date(movie.release_date).getFullYear(),
          isFavorite: this.favoritesService.isFavorite(movie.id)
        }));
      },
      error: (error) => {
        console.error('Error loading top-rated movies:', error);
      }
    });
  }

  /**
   * Load trending movies from TMDB API
   */
  private loadTrendingMovies() {
    this.moviesService.getTrendingMovies(1).subscribe({
      next: (response) => {
        console.log('Trending movies loaded:', response.results);

        // Map TMDB movies to local Movie interface
        this.trendingMovies = response.results.slice(0, 7).map(movie => ({
          id: movie.id,
          title: movie.title,
          poster: this.moviesService.getPosterUrl(movie.poster_path),
          rating: parseFloat(movie.vote_average.toFixed(1)),
          genre: this.getGenreFromIds(movie.genre_ids),
          year: new Date(movie.release_date).getFullYear(),
          isFavorite: this.favoritesService.isFavorite(movie.id)
        }));
      },
      error: (error) => {
        console.error('Error loading trending movies:', error);
      }
    });
  }

  /**
   * Load upcoming movies from TMDB API
   */
  private loadUpcomingMovies() {
    this.moviesService.getUpcomingMovies(1).subscribe({
      next: (response) => {
        console.log('Upcoming movies loaded:', response.results);

        // Map TMDB movies to local Movie interface
        this.upcomingMovies = response.results.slice(0, 10).map(movie => ({
          id: movie.id,
          title: movie.title,
          poster: this.moviesService.getPosterUrl(movie.poster_path),
          rating: parseFloat(movie.vote_average.toFixed(1)),
          genre: this.getGenreFromIds(movie.genre_ids),
          year: new Date(movie.release_date).getFullYear(),
          releaseDate: movie.release_date,
          isFavorite: this.favoritesService.isFavorite(movie.id)
        }));
      },
      error: (error) => {
        console.error('Error loading upcoming movies:', error);
      }
    });
  }

  /**
   * Get genre name from genre IDs (simplified version)
   * In production, you would fetch genre list from API
   */
  private getGenreFromIds(genreIds: number[]): string {
    const genreMap: { [key: number]: string } = {
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      36: 'History',
      27: 'Horror',
      10402: 'Music',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Sci-Fi',
      10770: 'TV Movie',
      53: 'Thriller',
      10752: 'War',
      37: 'Western'
    };

    return genreIds.length > 0 ? (genreMap[genreIds[0]] || 'Movie') : 'Movie';
  }

  selectCategory(category: Category) {
    // Navigate to category page with category name parameter
    this.router.navigate(['/category'], {
      queryParams: { categoryname: category.name.toLowerCase() }
    });
  }

  async toggleFavorite(movie: Movie) {
    try {
      await this.favoritesService.toggleFavorite(
        movie.id,
        movie.title,
        movie.genre,
        movie.poster
      );
      movie.isFavorite = this.favoritesService.isFavorite(movie.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  onSearch(event: any) {
    const query = event.target.value;
    // Add search logic here
    console.log('Searching for:', query);
  }

  goToCategories() {
    this.router.navigate(['/category']);
  }

  /**
   * Navigate to movie details page
   * @param movieId The TMDB movie ID
   */
  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie-details', movieId]);
  }
}
