import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: false,
})
export class UsersPage implements OnInit {
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  isSearching: boolean = false;
  followingStatus: Map<string, boolean> = new Map();

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    await this.loadAllUsers();
  }

  async ionViewWillEnter() {
    // Refresh users when entering the page
    await this.loadAllUsers();
  }

  async loadAllUsers() {
    this.isLoading = true;
    try {
      // Get all users by searching with empty string
      this.allUsers = await this.userService.searchUsers('');
      this.filteredUsers = [...this.allUsers];
      
      // Load following status for each user
      for (const user of this.allUsers) {
        const isFollowing = await this.userService.isFollowing(user.id);
        this.followingStatus.set(user.id, isFollowing);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.showToast('Error loading users', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  onSearch() {
    this.isSearching = true;
    
    if (!this.searchTerm || this.searchTerm.trim().length === 0) {
      this.filteredUsers = [...this.allUsers];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredUsers = this.allUsers.filter(user => 
        user.displayName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    this.isSearching = false;
  }

  async toggleFollow(user: User, event: Event) {
    // Prevent navigation to user details
    event.stopPropagation();

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.showToast('Please log in to follow users', 'warning');
      return;
    }

    const isFollowing = this.followingStatus.get(user.id) || false;
    
    const loading = await this.loadingController.create({
      message: isFollowing ? 'Unfollowing...' : 'Following...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      if (isFollowing) {
        await this.userService.unfollowUser(user.id);
        this.followingStatus.set(user.id, false);
        this.showToast(`Unfollowed ${user.displayName}`, 'success');
      } else {
        await this.userService.followUser(user.id);
        this.followingStatus.set(user.id, true);
        this.showToast(`Following ${user.displayName}`, 'success');
      }
    } catch (error) {
      console.error('Follow/Unfollow error:', error);
      this.showToast('Error updating follow status', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  viewUserDetails(userId: string) {
    this.router.navigate(['/user-details', userId]);
  }

  isFollowing(userId: string): boolean {
    return this.followingStatus.get(userId) || false;
  }

  async doRefresh(event: any) {
    await this.loadAllUsers();
    this.searchTerm = '';
    this.filteredUsers = [...this.allUsers];
    event.target.complete();
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color
    });
    await toast.present();
  }
}
