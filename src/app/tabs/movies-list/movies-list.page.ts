import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';

interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  genre: string;
  year: number;
  duration: string;
  description: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.page.html',
  styleUrls: ['./movies-list.page.scss'],
  standalone: false,
})
export class MoviesListPage implements OnInit {
  searchQuery: string = '';
  moviesList: Movie[] = [];
  filteredMovies: Movie[] = [];
  loading: boolean = true;

  constructor(private moviesService: MoviesService) { }

  ngOnInit() {
    this.loadMovies();
  }

  /**
   * Load popular movies from TMDB API
   */
  loadMovies() {
    this.loading = true;
    this.moviesService.getTopRatedMovies(1).subscribe({
      next: (response) => {
        console.log('Movies loaded:', response.results);

        // Map TMDB movies to local Movie interface
        this.moviesList = response.results.map(movie => ({
          id: movie.id,
          title: movie.title,
          poster: this.moviesService.getPosterUrl(movie.poster_path),
          rating: parseFloat(movie.vote_average.toFixed(1)),
          genre: this.getGenreFromIds(movie.genre_ids),
          year: new Date(movie.release_date).getFullYear(),
          duration: 'N/A', // Runtime not available in list endpoint
          description: movie.overview,
          isFavorite: false
        }));

        this.filteredMovies = [...this.moviesList];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading movies:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Get genre name from genre IDs (simplified version)
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

  /**
   * Filter movies based on search query
   */
  onSearch(event: any) {
    const query = event.target.value.toLowerCase();

    if (query.trim() === '') {
      this.filteredMovies = [...this.moviesList];
    } else {
      this.filteredMovies = this.moviesList.filter(movie =>
        movie.title.toLowerCase().includes(query) ||
        movie.genre.toLowerCase().includes(query) ||
        movie.description.toLowerCase().includes(query)
      );
    }
  }

  toggleFavorite(movie: Movie) {
    movie.isFavorite = !movie.isFavorite;
    // Add favorite management logic here
  }
}

