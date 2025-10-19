import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateTo(page: string) {
    console.log('Navigate to:', page);
    // Add navigation logic here
  }

  logout() {
    // Add logout logic here
    console.log('Logging out...');
    this.router.navigate(['/auth/login']);
  }
}

