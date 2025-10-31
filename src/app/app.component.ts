import { Component, OnInit } from '@angular/core';
import { FirebaseConfigCheckerService } from './services/firebase-config-checker.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private firebaseChecker: FirebaseConfigCheckerService
  ) { }

  ngOnInit() {
    // Check Firebase configuration on app startup
    this.firebaseChecker.checkConfiguration();
  }
}
