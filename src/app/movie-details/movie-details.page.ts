import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MoviesService, MovieDetails, Credits, Cast, Crew } from '../services/movies.service';
import { FavoritesService } from '../services/favorites.service';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';

interface UserProfile {
  id: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
}

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: false
})
export class MovieDetailsPage implements OnInit {
  movieId!: number;
  movie: MovieDetails | null = null;
  credits: Credits | null = null;
  cast: Cast[] = [];
  crew: Crew[] = [];
  director: Crew | null = null;

  isFavorite: boolean = false;
  usersWhoFavorited: UserProfile[] = [];
  favoritesCount: number = 0;

  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private moviesService: MoviesService,
    private favoritesService: FavoritesService,
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.movieId = parseInt(id, 10);
      this.loadMovieDetails();
    }
  }

  async loadMovieDetails() {
    this.loading = true;
    this.error = '';

    try {
      // Load movie details
      this.moviesService.getMovieDetails(this.movieId).subscribe(
        (movie) => {
          this.movie = movie;
        },
        (error) => {
          console.error('Error loading movie details:', error);
          this.error = 'Failed to load movie details';
        }
      );

      // Load movie credits
      this.moviesService.getMovieCredits(this.movieId).subscribe(
        (credits) => {
          this.credits = credits;
          this.cast = credits.cast.slice(0, 10); // Get top 10 cast members
          this.crew = credits.crew;
          this.director = credits.crew.find(member => member.job === 'Director') || null;
        },
        (error) => {
          console.error('Error loading movie credits:', error);
        }
      );

      // Check if current user has favorited this movie
      this.isFavorite = this.favoritesService.isFavorite(this.movieId);

      // Load users who favorited this movie
      await this.loadUsersWhoFavorited();

    } catch (error) {
      console.error('Error loading movie data:', error);
      this.error = 'Failed to load movie information';
    } finally {
      this.loading = false;
    }
  }

  async loadUsersWhoFavorited() {
    try {
      // Use the new method that returns favorite data with user info
      const favorites = await this.favoritesService.getFavoritesForMovie(this.movieId);
      this.favoritesCount = favorites.length;

      console.log('Favorites for movie:', favorites);

      // Map favorites to user profiles
      const userProfiles: UserProfile[] = [];

      for (const favorite of favorites) {
        // First, try to use the data stored in the favorite record
        if (favorite.userDisplayName) {
          userProfiles.push({
            id: favorite.userId,
            displayName: favorite.userDisplayName,
            email: favorite.userEmail,
            photoURL: undefined // We'll try to get this from Firestore
          });
        } else {
          // Fallback: try to get profile from Firestore
          const profile = await this.firestoreService.getUserProfile(favorite.userId) as any;
          console.log('Profile for user', favorite.userId, ':', profile);

          if (profile) {
            userProfiles.push({
              id: favorite.userId,
              displayName: profile.displayName || profile.email || 'User',
              email: profile.email,
              photoURL: profile.photoURL
            });
          } else {
            // Last resort: check if it's the current user
            const currentUser = this.authService.getCurrentUser();
            if (currentUser && currentUser.uid === favorite.userId) {
              userProfiles.push({
                id: favorite.userId,
                displayName: currentUser.displayName || currentUser.email || 'You',
                email: currentUser.email || undefined,
                photoURL: currentUser.photoURL || undefined
              });
            } else {
              // Very last fallback
              userProfiles.push({
                id: favorite.userId,
                displayName: favorite.userEmail || 'User ' + favorite.userId.substring(0, 6),
                email: favorite.userEmail,
                photoURL: undefined
              });
            }
          }
        }

        // Try to get photoURL from Firestore if not already set
        const lastProfile = userProfiles[userProfiles.length - 1];
        if (!lastProfile.photoURL) {
          const profile = await this.firestoreService.getUserProfile(favorite.userId) as any;
          if (profile && profile.photoURL) {
            lastProfile.photoURL = profile.photoURL;
          }
        }
      }

      console.log('Final user profiles:', userProfiles);
      this.usersWhoFavorited = userProfiles;
    } catch (error) {
      console.error('Error loading users who favorited:', error);
    }
  }

  async toggleFavorite() {
    if (!this.movie) return;

    try {
      const genre = this.movie.genres.length > 0 ? this.movie.genres[0].name : 'Unknown';
      await this.favoritesService.toggleFavorite(
        this.movie.id,
        this.movie.title,
        genre,
        this.movie.poster_path
      );

      this.isFavorite = !this.isFavorite;

      // Reload users who favorited
      await this.loadUsersWhoFavorited();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  getPosterUrl(path: string): string {
    return this.moviesService.getPosterUrl(path);
  }

  getBackdropUrl(path: string): string {
    return this.moviesService.getBackdropUrl(path);
  }

  getProfileUrl(path: string | null): string {
    return this.moviesService.getProfileUrl(path);
  }

  getGenres(): string {
    if (!this.movie || !this.movie.genres) return '';
    return this.movie.genres.map(g => g.name).join(', ');
  }

  getRuntimeFormatted(): string {
    if (!this.movie || !this.movie.runtime) return '';
    const hours = Math.floor(this.movie.runtime / 60);
    const minutes = this.movie.runtime % 60;
    return `${hours}h ${minutes}m`;
  }

  goBack() {
    this.navCtrl.back();
  }
}
