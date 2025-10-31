import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SocialButtonsComponent } from '../../components/social-button-component/social-buttons.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SocialButtonsComponent]
})
export class RegisterPage implements OnInit {
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordType: string = 'password';
  confirmPasswordType: string = 'password';
  passwordIcon: string = 'eye-off';
  confirmPasswordIcon: string = 'eye-off';
  acceptTerms: boolean = false;
  profileImage: string | undefined;
  formSubmitted: boolean = false;

  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  togglePassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  toggleConfirmPassword() {
    this.confirmPasswordType = this.confirmPasswordType === 'text' ? 'password' : 'text';
    this.confirmPasswordIcon = this.confirmPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  async selectImageSource() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Take Photo',
          icon: 'camera',
          handler: async () => {
            try {
              const image = await Camera.getPhoto({
                source: CameraSource.Camera,
                quality: 90,
                resultType: CameraResultType.DataUrl,
              });
              this.profileImage = image.dataUrl;
            } catch (error) {
              console.error('Camera error:', error);
            }
          }
        },
        {
          text: 'Choose from Gallery',
          icon: 'images',
          handler: async () => {
            try {
              const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Photos
              });
              this.profileImage = image.dataUrl;
            } catch (error) {
              console.error('Gallery error:', error);
            }
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async onRegister(form: any) {
    this.formSubmitted = true;

    // Validation checks
    if (!form.valid) {
      this.showToast('Please fill in all required fields', 'warning');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showToast('Passwords do not match', 'warning');
      return;
    }

    if (!this.acceptTerms) {
      this.showToast('Please accept the terms and conditions', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creating your account...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // Firebase Authentication Registration
      const userCredential = await this.authService.register(
        this.email,
        this.password,
        this.fullName
      );

      console.log('Registration successful:', userCredential.user);

      // TODO: Upload profile image to Firebase Storage if provided
      // if (this.profileImage) {
      //   const userId = userCredential.user.uid;
      //   await this.storageService.uploadBase64(`profile-photos/${userId}.jpg`, this.profileImage);
      // }

      await loading.dismiss();
      await this.showToast('Account created successfully!', 'success');

      // Navigate to home page on success
      this.router.navigate(['/tabs/home']);

    } catch (error: any) {
      await loading.dismiss();
      console.error('Registration error:', error);

      // Handle different Firebase error types
      let errorMessage = 'Registration failed. Please try again.';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
      }

      await this.showToast(errorMessage, 'danger');
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  onGoogleSignup() {
    this.showToast('Google signup coming soon!', 'primary');
  }

  onFacebookSignup() {
    this.showToast('Facebook signup coming soon!', 'primary');
  }

  onAppleSignup() {
    this.showToast('Apple signup coming soon!', 'primary');
  }

  // Helper method to show toast messages
  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }
}
