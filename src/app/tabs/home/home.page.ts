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

  constructor(private router: Router) { }

  selectCategory(category: Category) {
    this.categories.forEach(cat => cat.active = false);
    category.active = true;
    // Add filter logic here
  }

  toggleFavorite(movie: Movie) {
    movie.isFavorite = !movie.isFavorite;
    // Add favorite management logic here
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

