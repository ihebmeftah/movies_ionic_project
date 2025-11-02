import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  orderBy,
  limit
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';

export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt?: string;
}

export interface Follow {
  followerId: string; // User who is following
  followingId: string; // User being followed
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  /**
   * Search for users by display name
   * @param searchTerm The search term (name). If empty, returns all users.
   * @returns Array of matching users
   */
  async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const currentUser = this.authService.getCurrentUser();
      const usersCollection = collection(this.firestore, 'users');

      // Get all users (Firestore doesn't support text search, so we filter client-side)
      const querySnapshot = await getDocs(usersCollection);

      const users: User[] = [];

      // If no search term, return all users (except current user)
      if (!searchTerm || searchTerm.trim().length === 0) {
        querySnapshot.forEach((doc) => {
          if (doc.id !== currentUser?.uid) {
            const data = doc.data();
            users.push({
              id: doc.id,
              displayName: data['displayName'] || 'User',
              email: data['email'] || '',
              photoURL: data['photoURL'] || undefined,
              createdAt: data['createdAt']
            });
          }
        });
        return users;
      }

      // Convert search term to lowercase for case-insensitive search
      const searchLower = searchTerm.toLowerCase();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const displayName = (data['displayName'] || '').toLowerCase();
        const email = (data['email'] || '').toLowerCase();

        // Filter by display name or email containing search term
        if ((displayName.includes(searchLower) || email.includes(searchLower))
          && doc.id !== currentUser?.uid) { // Exclude current user
          users.push({
            id: doc.id,
            displayName: data['displayName'] || 'User',
            email: data['email'] || '',
            photoURL: data['photoURL'] || undefined,
            createdAt: data['createdAt']
          });
        }
      });

      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  /**
   * Follow a user
   * @param userId The ID of the user to follow
   */
  async followUser(userId: string): Promise<void> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      if (currentUser.uid === userId) {
        throw new Error('Cannot follow yourself');
      }

      // Create a follow relationship
      const followId = `${currentUser.uid}_${userId}`;
      const followRef = doc(this.firestore, 'follows', followId);

      const followData: Follow = {
        followerId: currentUser.uid,
        followingId: userId,
        createdAt: new Date().toISOString()
      };

      await setDoc(followRef, followData);
      console.log(`User ${currentUser.uid} followed user ${userId}`);
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }

  /**
   * Unfollow a user
   * @param userId The ID of the user to unfollow
   */
  async unfollowUser(userId: string): Promise<void> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const followId = `${currentUser.uid}_${userId}`;
      const followRef = doc(this.firestore, 'follows', followId);

      await deleteDoc(followRef);
      console.log(`User ${currentUser.uid} unfollowed user ${userId}`);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  }

  /**
   * Check if current user is following a specific user
   * @param userId The ID of the user to check
   * @returns true if following, false otherwise
   */
  async isFollowing(userId: string): Promise<boolean> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return false;
      }

      const followId = `${currentUser.uid}_${userId}`;
      const followRef = doc(this.firestore, 'follows', followId);
      const docSnap = await getDoc(followRef);

      return docSnap.exists();
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  }

  /**
   * Get list of users that the current user is following
   * @returns Array of users being followed
   */
  async getFollowing(userId?: string): Promise<User[]> {
    try {
      const currentUser = this.authService.getCurrentUser();
      const targetUserId = userId || currentUser?.uid;

      if (!targetUserId) {
        return [];
      }

      const followsCollection = collection(this.firestore, 'follows');
      const q = query(followsCollection, where('followerId', '==', targetUserId));
      const querySnapshot = await getDocs(q);

      const followingIds: string[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Follow;
        followingIds.push(data.followingId);
      });

      // Get user details for each followed user
      const users: User[] = [];
      for (const id of followingIds) {
        const user = await this.getUserById(id);
        if (user) {
          users.push(user);
        }
      }

      return users;
    } catch (error) {
      console.error('Error getting following list:', error);
      return [];
    }
  }

  /**
   * Get list of users following the current user
   * @returns Array of followers
   */
  async getFollowers(userId?: string): Promise<User[]> {
    try {
      const currentUser = this.authService.getCurrentUser();
      const targetUserId = userId || currentUser?.uid;

      if (!targetUserId) {
        return [];
      }

      const followsCollection = collection(this.firestore, 'follows');
      const q = query(followsCollection, where('followingId', '==', targetUserId));
      const querySnapshot = await getDocs(q);

      const followerIds: string[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Follow;
        followerIds.push(data.followerId);
      });

      // Get user details for each follower
      const users: User[] = [];
      for (const id of followerIds) {
        const user = await this.getUserById(id);
        if (user) {
          users.push(user);
        }
      }

      return users;
    } catch (error) {
      console.error('Error getting followers list:', error);
      return [];
    }
  }

  /**
   * Get follower and following counts for a user
   * @param userId Optional user ID (defaults to current user)
   * @returns Object with followers and following counts
   */
  async getFollowCounts(userId?: string): Promise<{ followers: number; following: number }> {
    try {
      const currentUser = this.authService.getCurrentUser();
      const targetUserId = userId || currentUser?.uid;

      if (!targetUserId) {
        return { followers: 0, following: 0 };
      }

      const followsCollection = collection(this.firestore, 'follows');

      // Get followers count
      const followersQuery = query(followsCollection, where('followingId', '==', targetUserId));
      const followersSnapshot = await getDocs(followersQuery);
      const followers = followersSnapshot.size;

      // Get following count
      const followingQuery = query(followsCollection, where('followerId', '==', targetUserId));
      const followingSnapshot = await getDocs(followingQuery);
      const following = followingSnapshot.size;

      return { followers, following };
    } catch (error) {
      console.error('Error getting follow counts:', error);
      return { followers: 0, following: 0 };
    }
  }

  /**
   * Get user by ID
   * @param userId The user ID
   * @returns User object or null
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userRef = doc(this.firestore, 'users', userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          displayName: data['displayName'] || 'User',
          email: data['email'] || '',
          photoURL: data['photoURL'] || undefined,
          createdAt: data['createdAt']
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }
}
