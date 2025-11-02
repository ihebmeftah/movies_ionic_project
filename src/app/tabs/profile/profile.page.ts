import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { UserService } from '../../services/user.service';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { FollowersModalComponent } from '../../components/followers-modal/followers-modal.component';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  stats: {
    followers: number;
    following: number;
    favorites: number;
    moviesWatched: number;
  };
}

interface GenreStats {
  name: string;
  count: number;
}

// Note: This UserProfile is different from the models/user-profile.model.ts
// as it includes additional stats property for the profile page display

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  userProfile: UserProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/300',
    stats: {
      followers: 0,
      following: 0,
      favorites: 0,
      moviesWatched: 0
    }
  };

  favoriteGenre: string = '';
  genreStats: GenreStats[] = [];
  totalMoviesWatched: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private userService: UserService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.loadUserProfile();
    this.loadUserStats();
  }

  ionViewWillEnter() {
    // Refresh stats when entering the page
    this.loadUserStats();
  }

  // Load user profile from Firebase Auth
  loadUserProfile() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userProfile.email = user.email || 'user@example.com';
      this.userProfile.name = user.displayName || 'User';

      // Set avatar from Firebase Auth or use default
      if (user.photoURL) {
        this.userProfile.avatar = user.photoURL;
      }
    }
  }

  // Load user statistics
  async loadUserStats() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    // Get favorites count and genre statistics
    const favoriteMovies = this.favoritesService.getFavoriteMovies();
    this.userProfile.stats.favorites = favoriteMovies.length;

    // Calculate genre statistics
    const genreMap = new Map<string, number>();

    favoriteMovies.forEach(movie => {
      if (movie.genre) {
        const genres = movie.genre.split(',').map(g => g.trim());
        genres.forEach(genre => {
          genreMap.set(genre, (genreMap.get(genre) || 0) + 1);
        });
      }
    });

    // Convert to array and sort by count
    this.genreStats = Array.from(genreMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Set favorite genre (most common)
    if (this.genreStats.length > 0) {
      this.favoriteGenre = this.genreStats[0].name;
    } else {
      this.favoriteGenre = 'Not yet available';
    }

    // For now, use favorites count as movies watched (you can adjust this logic)
    this.totalMoviesWatched = favoriteMovies.length;
    this.userProfile.stats.moviesWatched = this.totalMoviesWatched;

    // Get real followers/following counts
    const followCounts = await this.userService.getFollowCounts();
    this.userProfile.stats.followers = followCounts.followers;
    this.userProfile.stats.following = followCounts.following;
  }

  async openFollowersModal() {
    const modal = await this.modalController.create({
      component: FollowersModalComponent,
      componentProps: {
        mode: 'followers'
      }
    });
    await modal.present();

    // Refresh stats when modal is dismissed
    const { data } = await modal.onWillDismiss();
    this.loadUserStats();
  }

  async openFollowingModal() {
    const modal = await this.modalController.create({
      component: FollowersModalComponent,
      componentProps: {
        mode: 'following'
      }
    });
    await modal.present();

    // Refresh stats when modal is dismissed
    const { data } = await modal.onWillDismiss();
    this.loadUserStats();
  }

  navigateTo(page: string) {
    console.log('Navigate to:', page);
    // Add navigation logic here
  }

  navigateToUsers() {
    this.router.navigate(['/tabs/users']);
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Logout',
          role: 'confirm',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Logging out...',
              spinner: 'crescent'
            });
            await loading.present();

            try {
              await this.authService.logout();
              await loading.dismiss();
              this.router.navigate(['/auth']);
            } catch (error) {
              await loading.dismiss();
              console.error('Logout error:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }
}

