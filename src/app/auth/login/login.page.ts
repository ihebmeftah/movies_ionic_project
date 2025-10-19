import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { SocialButtonsComponent } from '../../components/social-button-component/social-buttons.component';

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

  constructor(private router: Router) { }

  ngOnInit() {
  }

  togglePassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  onLogin() {
    console.log('Login attempt:', { email: this.email, password: this.password });
    this.router.navigate(['/tabs/home']);
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }

  onGoogleLogin() {
    console.log('Google login clicked');
    // Implement Google login logic here
  }

  onFacebookLogin() {
    console.log('Facebook login clicked');
    // Implement Facebook login logic here
  }

  onAppleLogin() {
    console.log('Apple login clicked');
    // Implement Apple login logic here
  }
}
