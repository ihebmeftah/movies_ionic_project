import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { MatchingService, MatchingResult } from '../../services/matching.service';

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
  showMatchingOnly: boolean = false;
  matchingResults: Map<string, MatchingResult> = new Map();
  isLoadingMatching: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private matchingService: MatchingService,
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

    let usersToFilter = this.allUsers;

    // Apply matching filter first if enabled
    if (this.showMatchingOnly) {
      usersToFilter = usersToFilter.filter(user => {
        const matching = this.matchingResults.get(user.id);
        return matching && matching.matchPercentage >= 75;
      });
    }

    // Apply search term filter
    if (!this.searchTerm || this.searchTerm.trim().length === 0) {
      this.filteredUsers = [...usersToFilter];
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredUsers = usersToFilter.filter(user =>
        user.displayName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    this.isSearching = false;
  }

  async toggleMatchingFilter() {
    this.showMatchingOnly = !this.showMatchingOnly;

    if (this.showMatchingOnly && this.matchingResults.size === 0) {
      // Load matching data if not already loaded
      this.isLoadingMatching = true;
      try {
        for (const user of this.allUsers) {
          const matching = await this.matchingService.calculateMatching(user.id);
          this.matchingResults.set(user.id, matching);
        }
      } catch (error) {
        console.error('Error loading matching data:', error);
        this.showToast('Error loading matching data', 'danger');
      } finally {
        this.isLoadingMatching = false;
      }
    }

    // Re-apply filters
    this.onSearch();
  }

  getMatchPercentage(userId: string): number {
    return this.matchingResults.get(userId)?.matchPercentage || 0;
  }

  getMatchColor(percentage: number): string {
    if (percentage >= 75) return 'success';
    if (percentage >= 50) return 'warning';
    return 'medium';
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
