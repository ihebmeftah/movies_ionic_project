import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  stats: {
    movies: number;
    favorites: number;
    watchlist: number;
  };
}

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
      movies: 145,
      favorites: 23,
      watchlist: 12
    }
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  // Load user profile from Firebase Auth
  loadUserProfile() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userProfile.email = user.email || 'user@example.com';
      this.userProfile.name = user.displayName || 'User';
      // You can load more data from Firestore here
    }
  }

  navigateTo(page: string) {
    console.log('Navigate to:', page);
    // Add navigation logic here
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

