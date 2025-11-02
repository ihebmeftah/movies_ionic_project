import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

export interface FavoriteMovie {
  userId: string;
  userDisplayName?: string;
  userEmail?: string;
  movieId: number;
  movieTitle: string;
  movieGenre: string;
  posterPath: string;
  addedAt: Date;
}

// Simplified Movie interface for favorites display
export interface FavoriteMovieDisplay {
  id: number;
  title: string;
  genre: string;
  posterPath: string;
  addedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<number[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  private favoriteMoviesSubject = new BehaviorSubject<FavoriteMovieDisplay[]>([]);
  public favoriteMovies$ = this.favoriteMoviesSubject.asObservable();

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {
    // Load favorites when user logs in
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadUserFavorites();
      } else {
        this.favoritesSubject.next([]);
        this.favoriteMoviesSubject.next([]);
      }
    });
  }

  /**
   * Add a movie to favorites
   * @param movieId The TMDB movie ID
   * @param movieTitle The movie title
   * @param movieGenre The movie genre
   * @param posterPath The movie poster path
   */
  async addToFavorites(
    movieId: number,
    movieTitle: string,
    movieGenre: string,
    posterPath: string
  ): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.error('Cannot add to favorites: User not authenticated');
      throw new Error('User not authenticated');
    }

    try {
      console.log(`Adding movie ${movieId} (${movieTitle}) to favorites for user ${user.uid}`);
      const favoriteRef = doc(this.firestore, 'favorites', `${user.uid}_${movieId}`);
      const favoriteData: FavoriteMovie = {
        userId: user.uid,
        userDisplayName: user.displayName || user.email || 'User',
        userEmail: user.email || undefined,
        movieId: movieId,
        movieTitle: movieTitle,
        movieGenre: movieGenre,
        posterPath: posterPath,
        addedAt: new Date()
      };

      await setDoc(favoriteRef, favoriteData);
      console.log(`Successfully added movie ${movieId} (${movieTitle}) to favorites`);

      // Update local state
      const currentFavorites = this.favoritesSubject.value;
      if (!currentFavorites.includes(movieId)) {
        this.favoritesSubject.next([...currentFavorites, movieId]);
        await this.loadUserFavorites(); // Reload to update the movies list
      }
    } catch (error: any) {
      console.error('Error adding to favorites:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error;
    }
  }

  /**
   * Remove a movie from favorites
   * @param movieId The TMDB movie ID
   */
  async removeFromFavorites(movieId: number): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const favoriteRef = doc(this.firestore, 'favorites', `${user.uid}_${movieId}`);
      await deleteDoc(favoriteRef);

      // Update local state
      const currentFavorites = this.favoritesSubject.value;
      this.favoritesSubject.next(currentFavorites.filter(id => id !== movieId));

      const currentMovies = this.favoriteMoviesSubject.value;
      this.favoriteMoviesSubject.next(currentMovies.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }

  /**
   * Toggle favorite status of a movie
   * @param movieId The TMDB movie ID
   * @param movieTitle The movie title
   * @param movieGenre The movie genre
   * @param posterPath The movie poster path
   */
  async toggleFavorite(
    movieId: number,
    movieTitle: string,
    movieGenre: string,
    posterPath: string
  ): Promise<void> {
    if (this.isFavorite(movieId)) {
      await this.removeFromFavorites(movieId);
    } else {
      await this.addToFavorites(movieId, movieTitle, movieGenre, posterPath);
    }
  }

  /**
   * Check if a movie is in favorites
   * @param movieId The TMDB movie ID
   */
  isFavorite(movieId: number): boolean {
    return this.favoritesSubject.value.includes(movieId);
  }

  /**
   * Load all favorite movies for the current user from Firebase
   */
  private async loadUserFavorites(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.log('No user logged in, skipping favorites load');
      return;
    }

    try {
      console.log(`Loading favorites for user: ${user.uid}`);
      const favoritesCollection = collection(this.firestore, 'favorites');
      const q = query(favoritesCollection, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const favoriteIds: number[] = [];
      const favoriteMovies: FavoriteMovieDisplay[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FavoriteMovie;
        favoriteIds.push(data.movieId);

        // Create display object from Firebase data
        favoriteMovies.push({
          id: data.movieId,
          title: data.movieTitle,
          genre: data.movieGenre,
          posterPath: data.posterPath,
          addedAt: data.addedAt
        });
      });

      console.log(`Loaded ${favoriteIds.length} favorites from Firebase`);

      // Update both subjects
      this.favoritesSubject.next(favoriteIds);
      this.favoriteMoviesSubject.next(favoriteMovies);

    } catch (error: any) {
      console.error('Error loading favorites:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);

      // Don't throw error, just log it and continue with empty favorites
      this.favoritesSubject.next([]);
      this.favoriteMoviesSubject.next([]);
    }
  }

  /**
   * Get all favorite movies for the current user
   */
  getFavoriteMovies(): FavoriteMovieDisplay[] {
    return this.favoriteMoviesSubject.value;
  }

  /**
   * Get all favorite movie IDs for the current user
   */
  getFavoriteIds(): number[] {
    return this.favoritesSubject.value;
  }

  /**
   * Refresh favorites from Firebase
   */
  async refreshFavorites(): Promise<void> {
    await this.loadUserFavorites();
  }

  /**
   * Get the count of favorite movies
   */
  getFavoritesCount(): number {
    return this.favoritesSubject.value.length;
  }

  /**
   * Get all users who favorited a specific movie
   * @param movieId The TMDB movie ID
   * @returns Promise with array of user IDs who favorited this movie
   */
  async getUsersWhoFavoritedMovie(movieId: number): Promise<string[]> {
    try {
      const favoritesCollection = collection(this.firestore, 'favorites');
      const q = query(favoritesCollection, where('movieId', '==', movieId));
      const querySnapshot = await getDocs(q);

      const userIds: string[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FavoriteMovie;
        if (!userIds.includes(data.userId)) {
          userIds.push(data.userId);
        }
      });

      return userIds;
    } catch (error) {
      console.error('Error getting users who favorited movie:', error);
      return [];
    }
  }

  /**
   * Get all favorite records for a specific movie (includes user info)
   * @param movieId The TMDB movie ID
   * @returns Promise with array of FavoriteMovie objects
   */
  async getFavoritesForMovie(movieId: number): Promise<FavoriteMovie[]> {
    try {
      const favoritesCollection = collection(this.firestore, 'favorites');
      const q = query(favoritesCollection, where('movieId', '==', movieId));
      const querySnapshot = await getDocs(q);

      const favorites: FavoriteMovie[] = [];
      const uniqueUserIds = new Set<string>();

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FavoriteMovie;
        // Only add if we haven't seen this user yet (in case of duplicates)
        if (!uniqueUserIds.has(data.userId)) {
          uniqueUserIds.add(data.userId);
          favorites.push(data);
        }
      });

      return favorites;
    } catch (error) {
      console.error('Error getting favorites for movie:', error);
      return [];
    }
  }
}
