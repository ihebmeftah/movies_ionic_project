import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule]
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

    constructor(private router: Router) { }

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

    onRegister() {
        if (this.password !== this.confirmPassword) {
            console.error('Passwords do not match!');
            return;
        }
        if (!this.acceptTerms) {
            console.error('Please accept terms and conditions!');
            return;
        }
        console.log('Register attempt:', {
            fullName: this.fullName,
            email: this.email,
            password: this.password
        });
        // Add your registration logic here
        // For now, navigate to home
        this.router.navigate(['/home']);
    }

    goToLogin() {
        this.router.navigate(['/auth/login']);
    }
}
