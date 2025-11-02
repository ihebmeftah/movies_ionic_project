import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { UserService, User } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { FollowersModalComponent } from '../components/followers-modal/followers-modal.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
  standalone: false,
})
export class UserDetailsPage implements OnInit {
  userId!: string;
  user: User | null = null;
  isLoading: boolean = true;
  isFollowing: boolean = false;
  isCurrentUser: boolean = false;

  followersCount: number = 0;
  followingCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private userService: UserService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    if (this.userId) {
      await this.loadUserDetails();
    }
  }

  async loadUserDetails() {
    this.isLoading = true;
    try {
      // Check if viewing own profile
      const currentUser = this.authService.getCurrentUser();
      this.isCurrentUser = currentUser?.uid === this.userId;

      // Load user details
      this.user = await this.userService.getUserById(this.userId);

      if (!this.user) {
        this.showToast('User not found', 'danger');
        this.goBack();
        return;
      }

      // Load follow status and counts
      if (!this.isCurrentUser) {
        this.isFollowing = await this.userService.isFollowing(this.userId);
      }

      const counts = await this.userService.getFollowCounts(this.userId);
      this.followersCount = counts.followers;
      this.followingCount = counts.following;

    } catch (error) {
      console.error('Error loading user details:', error);
      this.showToast('Error loading user details', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async toggleFollow() {
    if (this.isCurrentUser) {
      this.showToast('You cannot follow yourself', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: this.isFollowing ? 'Unfollowing...' : 'Following...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      if (this.isFollowing) {
        await this.userService.unfollowUser(this.userId);
        this.isFollowing = false;
        this.followersCount = Math.max(0, this.followersCount - 1);
        this.showToast(`Unfollowed ${this.user?.displayName}`, 'success');
      } else {
        await this.userService.followUser(this.userId);
        this.isFollowing = true;
        this.followersCount++;
        this.showToast(`Following ${this.user?.displayName}`, 'success');
      }
    } catch (error) {
      console.error('Follow/Unfollow error:', error);
      this.showToast('Error updating follow status', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async openFollowersModal() {
    const modal = await this.modalController.create({
      component: FollowersModalComponent,
      componentProps: {
        mode: 'followers',
        userId: this.userId
      }
    });
    await modal.present();

    // Refresh counts when modal is dismissed
    const { data } = await modal.onWillDismiss();
    const counts = await this.userService.getFollowCounts(this.userId);
    this.followersCount = counts.followers;
    this.followingCount = counts.following;
  }

  async openFollowingModal() {
    const modal = await this.modalController.create({
      component: FollowersModalComponent,
      componentProps: {
        mode: 'following',
        userId: this.userId
      }
    });
    await modal.present();

    // Refresh counts when modal is dismissed
    const { data } = await modal.onWillDismiss();
    const counts = await this.userService.getFollowCounts(this.userId);
    this.followersCount = counts.followers;
    this.followingCount = counts.following;
  }

  goBack() {
    this.navCtrl.back();
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
