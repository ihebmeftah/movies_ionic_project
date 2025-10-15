import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
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
    // Add your login logic here
    // For now, navigate to home
    this.router.navigate(['/home']);
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}
