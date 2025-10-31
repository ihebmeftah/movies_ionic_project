import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseConfigCheckerService {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) { }

  /**
   * Check if Firebase is configured correctly
   * @returns boolean - true if configured correctly, false otherwise
   */
  checkConfiguration(): boolean {
    console.log('🔥 ========================================');
    console.log('🔥 Firebase Configuration Check');
    console.log('🔥 ========================================');

    try {
      // Step 1: Check if Firebase config exists
      if (!environment.firebaseConfig) {
        console.error('❌ FAILED: Firebase config is missing in environment file!');
        console.log('🔥 ========================================');
        return false;
      }

      // Step 2: Check if all required config fields are present
      const config = environment.firebaseConfig;
      const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
      const missingFields = requiredFields.filter(field => !config[field as keyof typeof config]);

      if (missingFields.length > 0) {
        console.error('❌ FAILED: Missing required Firebase config fields:', missingFields);
        console.log('🔥 ========================================');
        return false;
      }

      // Step 3: Check if values are still placeholders
      if (config.apiKey.includes('YOUR_') || config.apiKey === 'YOUR_API_KEY') {
        console.error('❌ FAILED: Firebase config contains placeholder values!');
        console.error('   Please replace placeholder values in environment.ts with actual Firebase credentials');
        console.log('🔥 ========================================');
        return false;
      }

      // Step 4: Check if Firebase services are initialized
      const servicesStatus = {
        auth: !!this.auth,
        firestore: !!this.firestore,
      };

      console.log('📊 Firebase Services Status:');
      console.log('   - Auth:', servicesStatus.auth ? '✅ Initialized' : '❌ Not Initialized');
      console.log('   - Firestore:', servicesStatus.firestore ? '✅ Initialized' : '❌ Not Initialized');

      if (!servicesStatus.auth || !servicesStatus.firestore) {
        console.error('❌ FAILED: Some Firebase services are not initialized!');
        console.log('🔥 ========================================');
        return false;
      }

      // Step 5: All checks passed
      console.log('');
      console.log('✅ SUCCESS: Firebase is configured correctly!');
      console.log('📋 Configuration Details:');
      console.log('   - Project ID:', config.projectId);
      console.log('   - Auth Domain:', config.authDomain);
      console.log('   - Storage Bucket:', config.storageBucket);
      console.log('🔥 ========================================');

      return true;

    } catch (error) {
      console.error('❌ FAILED: Error checking Firebase configuration:', error);
      console.log('🔥 ========================================');
      return false;
    }
  }

  /**
   * Quick check - just returns true/false without console logs
   */
  isConfigured(): boolean {
    try {
      const config = environment.firebaseConfig;
      return !!(
        config &&
        config.apiKey &&
        config.projectId &&
        !config.apiKey.includes('YOUR_') &&
        this.auth &&
        this.firestore
      );
    } catch {
      return false;
    }
  }

  /**
   * Get Firebase project information
   */
  getProjectInfo(): any {
    if (!environment.firebaseConfig) {
      return null;
    }

    return {
      projectId: environment.firebaseConfig.projectId,
      authDomain: environment.firebaseConfig.authDomain,
      storageBucket: environment.firebaseConfig.storageBucket,
      isConfigured: this.isConfigured()
    };
  }
}
