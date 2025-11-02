/**
 * User Profile Model
 *
 * Represents a user profile with authentication and display information.
 *
 * Used in:
 * - ProfilePage: To display user profile information and statistics
 * - MovieDetailsPage: To access current user information for favorites management
 * - AuthService: To manage authenticated user data
 *
 * @interface UserProfile
 */
export interface UserProfile {
  /** Unique identifier for the user */
  id: string;

  /** Display name of the user (optional) */
  displayName?: string;

  /** Email address of the user (optional) */
  email?: string;

  /** URL to the user's profile photo (optional) */
  photoURL?: string;
}
