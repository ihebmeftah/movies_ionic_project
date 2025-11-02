import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

export interface MatchingResult {
  userId: string;
  matchPercentage: number;
  commonMovies: number;
  commonGenres: string[];
  totalCurrentUserFavorites: number;
  totalOtherUserFavorites: number;
}

export interface MovieMatch {
  movieId: number;
  movieTitle: string;
  movieGenre: string;
  posterPath: string;
}

@Injectable({
  providedIn: 'root'
})
export class MatchingService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  /**
   * Calculate matching percentage between current user and another user
   * based on favorite movies and genres
   */
  async calculateMatching(otherUserId: string): Promise<MatchingResult> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return this.getEmptyMatchingResult(otherUserId);
      }

      // Get current user's favorites
      const currentUserFavorites = await this.getUserFavorites(currentUser.uid);

      // Get other user's favorites
      const otherUserFavorites = await this.getUserFavorites(otherUserId);

      if (currentUserFavorites.length === 0 || otherUserFavorites.length === 0) {
        return this.getEmptyMatchingResult(otherUserId);
      }

      // Calculate common movies
      const currentUserMovieIds = new Set(currentUserFavorites.map(f => f.movieId));
      const otherUserMovieIds = new Set(otherUserFavorites.map(f => f.movieId));

      const commonMovieIds = [...currentUserMovieIds].filter(id => otherUserMovieIds.has(id));
      const commonMovies = commonMovieIds.length;

      // Calculate common genres
      const currentUserGenres = this.extractGenres(currentUserFavorites);
      const otherUserGenres = this.extractGenres(otherUserFavorites);

      const commonGenres = currentUserGenres.filter(genre => otherUserGenres.includes(genre));

      // Calculate matching percentage
      // Weight: 60% for common movies, 40% for common genres
      const movieMatchPercentage = (commonMovies / Math.min(currentUserFavorites.length, otherUserFavorites.length)) * 100;
      const genreMatchPercentage = (commonGenres.length / Math.max(currentUserGenres.length, otherUserGenres.length)) * 100;

      const matchPercentage = Math.round((movieMatchPercentage * 0.6) + (genreMatchPercentage * 0.4));

      return {
        userId: otherUserId,
        matchPercentage: Math.min(matchPercentage, 100),
        commonMovies,
        commonGenres: commonGenres.slice(0, 5), // Top 5 common genres
        totalCurrentUserFavorites: currentUserFavorites.length,
        totalOtherUserFavorites: otherUserFavorites.length
      };

    } catch (error) {
      console.error('Error calculating matching:', error);
      return this.getEmptyMatchingResult(otherUserId);
    }
  }

  /**
   * Get common movies between current user and another user
   */
  async getCommonMovies(otherUserId: string): Promise<MovieMatch[]> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return [];
      }

      const currentUserFavorites = await this.getUserFavorites(currentUser.uid);
      const otherUserFavorites = await this.getUserFavorites(otherUserId);

      const currentUserMovieIds = new Set(currentUserFavorites.map(f => f.movieId));

      const commonMovies: MovieMatch[] = [];

      for (const favorite of otherUserFavorites) {
        if (currentUserMovieIds.has(favorite.movieId)) {
          commonMovies.push({
            movieId: favorite.movieId,
            movieTitle: favorite.movieTitle,
            movieGenre: favorite.movieGenre,
            posterPath: favorite.posterPath
          });
        }
      }

      return commonMovies;
    } catch (error) {
      console.error('Error getting common movies:', error);
      return [];
    }
  }

  /**
   * Get users with matching percentage above threshold
   */
  async getMatchingUsers(minMatchPercentage: number = 75): Promise<Array<{ userId: string, matchPercentage: number }>> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return [];
      }

      // Get all users from favorites collection (unique user IDs)
      const favoritesCollection = collection(this.firestore, 'favorites');
      const querySnapshot = await getDocs(favoritesCollection);

      const userIds = new Set<string>();
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data['userId'] && data['userId'] !== currentUser.uid) {
          userIds.add(data['userId']);
        }
      });

      // Calculate matching for each user
      const matchingResults: Array<{ userId: string, matchPercentage: number }> = [];

      for (const userId of userIds) {
        const matching = await this.calculateMatching(userId);
        if (matching.matchPercentage >= minMatchPercentage) {
          matchingResults.push({
            userId,
            matchPercentage: matching.matchPercentage
          });
        }
      }

      // Sort by match percentage (descending)
      return matchingResults.sort((a, b) => b.matchPercentage - a.matchPercentage);

    } catch (error) {
      console.error('Error getting matching users:', error);
      return [];
    }
  }

  /**
   * Get user's favorite movies from Firestore
   */
  private async getUserFavorites(userId: string): Promise<any[]> {
    try {
      const favoritesCollection = collection(this.firestore, 'favorites');
      const q = query(favoritesCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      const favorites: any[] = [];
      querySnapshot.forEach((doc) => {
        favorites.push(doc.data());
      });

      return favorites;
    } catch (error) {
      console.error('Error getting user favorites:', error);
      return [];
    }
  }

  /**
   * Extract unique genres from favorites
   */
  private extractGenres(favorites: any[]): string[] {
    const genresSet = new Set<string>();

    favorites.forEach(favorite => {
      if (favorite.movieGenre) {
        const genres = favorite.movieGenre.split(',').map((g: string) => g.trim());
        genres.forEach((genre: string) => genresSet.add(genre));
      }
    });

    return Array.from(genresSet);
  }

  /**
   * Get empty matching result
   */
  private getEmptyMatchingResult(userId: string): MatchingResult {
    return {
      userId,
      matchPercentage: 0,
      commonMovies: 0,
      commonGenres: [],
      totalCurrentUserFavorites: 0,
      totalOtherUserFavorites: 0
    };
  }
}
