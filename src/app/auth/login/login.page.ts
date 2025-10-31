import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SocialButtonsComponent } from '../../components/social-button-component/social-buttons.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SocialButtonsComponent]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  formSubmitted: boolean = false;

  constructor(
    private router: Router,
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

  async onLogin(form: any) {
    this.formSubmitted = true;

    if (!form.valid) {
      this.showToast('Please fill in all required fields', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Signing in...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // Firebase Authentication Login
      const userCredential = await this.authService.login(this.email, this.password);
      console.log('Login successful:', userCredential.user);

      await loading.dismiss();
      await this.showToast('Welcome back!', 'success');

      // Navigate to home page on success
      this.router.navigate(['/tabs/home']);

    } catch (error: any) {
      await loading.dismiss();
      console.error('Login error:', error);

      // Handle different Firebase error types
      let errorMessage = 'Login failed. Please try again.';

      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }

      await this.showToast(errorMessage, 'danger');
    }
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }

  onGoogleLogin() {
    this.showToast('Google login coming soon!', 'primary');
  }

  onFacebookLogin() {
    this.showToast('Facebook login coming soon!', 'primary');
  }

  onAppleLogin() {
    this.showToast('Apple login coming soon!', 'primary');
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
