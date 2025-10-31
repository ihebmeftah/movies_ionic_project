import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * No-Auth Guard - Prevents authenticated users from accessing auth pages
 * Redirects to /tabs/home if user is already authenticated
 */
export const noAuthGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await authService.isAuthenticated();

  if (!isAuthenticated) {
    return true;
  } else {
    // User is already logged in, redirect to home
    router.navigate(['/tabs/home']);
    return false;
  }
};
