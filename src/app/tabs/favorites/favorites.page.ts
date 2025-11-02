import { Component, OnInit } from '@angular/core';
import { FavoritesService, FavoriteMovieDisplay } from '../../services/favorites.service';
import { MoviesService } from '../../services/movies.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: false,
})
export class FavoritesPage implements OnInit {
  favoriteMovies: FavoriteMovieDisplay[] = [];
  favoriteMovies$: Observable<FavoriteMovieDisplay[]>;
  isLoading = false;

  constructor(
    private favoritesService: FavoritesService,
    private moviesService: MoviesService
  ) {
    this.favoriteMovies$ = this.favoritesService.favoriteMovies$;
  }

  ngOnInit() {
    this.loadFavorites();

    // Subscribe to favorite movies changes
    this.favoritesService.favoriteMovies$.subscribe(movies => {
      this.favoriteMovies = movies;
      this.isLoading = false;
    });
  }

  async loadFavorites() {
    this.isLoading = true;
    try {
      await this.favoritesService.refreshFavorites();
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async removeFavorite(movie: FavoriteMovieDisplay) {
    try {
      await this.favoritesService.removeFromFavorites(movie.id);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  isFavorite(movieId: number): boolean {
    return this.favoritesService.isFavorite(movieId);
  }

  getPosterUrl(posterPath: string): string {
    return this.moviesService.getPosterUrl(posterPath);
  }

  async doRefresh(event: any) {
    try {
      await this.loadFavorites();
    } finally {
      event.target.complete();
    }
  }
}

