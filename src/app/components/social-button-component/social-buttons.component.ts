import { Component, EventEmitter, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-social-buttons',
  templateUrl: './social-buttons.component.html',
  styleUrls: ['./social-buttons.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class SocialButtonsComponent {
  @Output() googleClick = new EventEmitter<void>();
  @Output() facebookClick = new EventEmitter<void>();
  @Output() appleClick = new EventEmitter<void>();

  onGoogleClick() {
    this.googleClick.emit();
  }

  onFacebookClick() {
    this.facebookClick.emit();
  }

  onAppleClick() {
    this.appleClick.emit();
  }
}
