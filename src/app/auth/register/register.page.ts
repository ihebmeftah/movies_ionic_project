import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
  profileImage: string | undefined;

  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController
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
            const image = await Camera.getPhoto({
              source: CameraSource.Camera,
              quality: 90,
              resultType: CameraResultType.DataUrl,
            });
            this.profileImage = image.dataUrl;
          }
        },
        {
          text: 'Choose from Gallery',
          icon: 'images',
          handler: async () => {
            const image = await Camera.getPhoto({
              quality: 90,
              allowEditing: true,
              resultType: CameraResultType.DataUrl,
              source: CameraSource.Photos
            });
            this.profileImage = image.dataUrl;
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
      password: this.password,
      profileImage: this.profileImage
    });
    // Add your registration logic here
    // For now, navigate to home
    this.router.navigate(['/home']);
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
