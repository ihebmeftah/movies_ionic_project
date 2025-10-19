import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Category {
  name: string;
  icon: string;
  active: boolean;
}

interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  genre: string;
  year: number;
  isFavorite: boolean;
}

interface User {
  id: number;
  name: string;
  avatar: string;
  location: string;
  isOnline: boolean;
}

interface Actor {
  id: number;
  name: string;
  image: string;
  knownFor: string;
  rating: number;
  isFavorite: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  searchQuery: string = '';

  categories: Category[] = [
    { name: 'All', icon: 'apps', active: true },
    { name: 'Action', icon: 'flame', active: false },
    { name: 'Comedy', icon: 'happy', active: false },
    { name: 'Drama', icon: 'sad', active: false },
    { name: 'Horror', icon: 'skull', active: false },
    { name: 'Sci-Fi', icon: 'rocket', active: false },
  ];

  topMovies: Movie[] = [
    {
      id: 1,
      title: 'Inception',
      poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      rating: 8.8,
      genre: 'Sci-Fi',
      year: 2010,
      isFavorite: false
    },
    {
      id: 2,
      title: 'The Dark Knight',
      poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      rating: 9.0,
      genre: 'Action',
      year: 2008,
      isFavorite: false
    },
    {
      id: 3,
      title: 'Interstellar',
      poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      rating: 8.6,
      genre: 'Sci-Fi',
      year: 2014,
      isFavorite: true
    },
    {
      id: 4,
      title: 'Pulp Fiction',
      poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
      rating: 8.9,
      genre: 'Crime',
      year: 1994,
      isFavorite: false
    }
  ];

  trendingMovies: Movie[] = [
    {
      id: 5,
      title: 'Avatar',
      poster: 'https://image.tmdb.org/t/p/w500/6EiRUJpuoeQPghrs3YNd6Y2kLdt.jpg',
      rating: 7.8,
      genre: 'Sci-Fi',
      year: 2009,
      isFavorite: false
    },
    {
      id: 6,
      title: 'The Matrix',
      poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
      rating: 8.7,
      genre: 'Sci-Fi',
      year: 1999,
      isFavorite: true
    },
    {
      id: 7,
      title: 'Gladiator',
      poster: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
      rating: 8.5,
      genre: 'Action',
      year: 2000,
      isFavorite: false
    }
  ];

  users: User[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      location: 'New York',
      isOnline: true
    },
    {
      id: 2,
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'Los Angeles',
      isOnline: true
    },
    {
      id: 3,
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      location: 'London',
      isOnline: false
    },
    {
      id: 4,
      name: 'David Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      location: 'Madrid',
      isOnline: true
    },
    {
      id: 5,
      name: 'Lisa Park',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      location: 'Seoul',
      isOnline: true
    }
  ];

  actors: Actor[] = [
    {
      id: 1,
      name: 'Leonardo DiCaprio',
      image: 'https://image.tmdb.org/t/p/w500/wo2hJp04iT5l3hZ8AcLio4kjiuq.jpg',
      knownFor: 'Inception, Titanic',
      rating: 9.2,
      isFavorite: false
    },
    {
      id: 2,
      name: 'Scarlett Johansson',
      image: 'https://image.tmdb.org/t/p/w500/6WQpSxH6Y4xepXrIKd78nARuYVx.jpg',
      knownFor: 'Avengers, Lost in Translation',
      rating: 8.8,
      isFavorite: true
    },
    {
      id: 3,
      name: 'Tom Hanks',
      image: 'https://image.tmdb.org/t/p/w500/xndWFsBlClOJFRdhSt4NBwiPq2o.jpg',
      knownFor: 'Forrest Gump, Cast Away',
      rating: 9.0,
      isFavorite: false
    },
    {
      id: 4,
      name: 'Emma Stone',
      image: 'https://image.tmdb.org/t/p/w500/2hwXbYKyqFqgCNd3QHxV3kqk3hm.jpg',
      knownFor: 'La La Land, The Help',
      rating: 8.5,
      isFavorite: true
    },
    {
      id: 5,
      name: 'Ryan Gosling',
      image: 'https://image.tmdb.org/t/p/w500/lyvszvJJqqI8aqBJ70XzdCNoK0y.jpg',
      knownFor: 'La La Land, Drive',
      rating: 8.7,
      isFavorite: false
    }
  ];

  constructor(private router: Router) { }

  selectCategory(category: Category) {
    // Navigate to category page with category name parameter
    this.router.navigate(['/category'], {
      queryParams: { categoryname: category.name.toLowerCase() }
    });
  }

  toggleFavorite(movie: Movie) {
    movie.isFavorite = !movie.isFavorite;
    // Add favorite management logic here
  }

  toggleActorFavorite(actor: Actor) {
    actor.isFavorite = !actor.isFavorite;
    // Add actor favorite management logic here
  }

  onSearch(event: any) {
    const query = event.target.value;
    // Add search logic here
    console.log('Searching for:', query);
  }

  goToCategories() {
    this.router.navigate(['/category']);
  }
}

