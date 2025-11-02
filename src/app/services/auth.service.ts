import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
  updateProfile
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    // Initialize auth state listener
    this.initAuthListener();
  }

  // Initialize auth state listener
  private initAuthListener() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
      if (user) {
        console.log('User logged in:', user.email);
      } else {
        console.log('User logged out');
      }
    });
  }

  // Register new user
  async register(email: string, password: string, displayName?: string) {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);

      // Update user profile with display name if provided
      if (displayName && credential.user) {
        await updateProfile(credential.user, { displayName });
      }

      // Save user profile to Firestore
      if (credential.user) {
        await this.saveUserProfile(credential.user.uid, {
          email: credential.user.email || '',
          displayName: displayName || credential.user.email || 'User',
          createdAt: new Date().toISOString(),
          photoURL: credential.user.photoURL || null
        });
      }

      return credential;
    } catch (error) {
      throw error;
    }
  }

  // Save user profile to Firestore
  private async saveUserProfile(userId: string, profileData: any) {
    try {
      const userRef = doc(this.firestore, 'users', userId);
      await setDoc(userRef, profileData);
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  // Login user
  async login(email: string, password: string) {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);

      // Check if user profile exists in Firestore, if not create it
      if (credential.user) {
        const userRef = doc(this.firestore, 'users', credential.user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          // Create profile for existing user who doesn't have one
          await this.saveUserProfile(credential.user.uid, {
            email: credential.user.email || '',
            displayName: credential.user.displayName || credential.user.email || 'User',
            createdAt: new Date().toISOString(),
            photoURL: credential.user.photoURL || null
          });
        }
      }

      return credential;
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        unsubscribe();
        resolve(!!user);
      });
    });
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Auth state observer
  getAuthState(): Observable<User | null> {
    return new Observable((observer) => {
      onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });
    });
  }

  // Get user email
  getUserEmail(): string | null {
    return this.auth.currentUser?.email || null;
  }

  // Get user display name
  getUserDisplayName(): string | null {
    return this.auth.currentUser?.displayName || null;
  }

  // Get user ID
  getUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }
}
