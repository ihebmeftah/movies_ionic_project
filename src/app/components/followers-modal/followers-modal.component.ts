import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-followers-modal',
  templateUrl: './followers-modal.component.html',
  styleUrls: ['./followers-modal.component.scss'],
  standalone: false,
})
export class FollowersModalComponent implements OnInit {
  @Input() mode: 'followers' | 'following' = 'followers';
  @Input() userId?: string;
  
  users: User[] = [];
  isLoading: boolean = true;
  followingStatus: Map<string, boolean> = new Map();

  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    this.isLoading = true;
    try {
      if (this.mode === 'followers') {
        this.users = await this.userService.getFollowers(this.userId);
      } else {
        this.users = await this.userService.getFollowing(this.userId);
      }

      // Load following status for each user
      for (const user of this.users) {
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

  async toggleFollow(user: User) {
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
        
        // If we're in the following list and unfollowed, remove from list
        if (this.mode === 'following') {
          this.users = this.users.filter(u => u.id !== user.id);
        }
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

  isFollowing(userId: string): boolean {
    return this.followingStatus.get(userId) || false;
  }

  getTitle(): string {
    return this.mode === 'followers' ? 'Followers' : 'Following';
  }

  dismiss() {
    this.modalController.dismiss();
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