import { Component, OnInit } from '@angular/core';

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
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: false,
})
export class FavoritesPage implements OnInit {
  favoriteMovies: Movie[] = [
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
      id: 5,
      title: 'The Shawshank Redemption',
      poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      rating: 9.3,
      genre: 'Drama',
      year: 1994,
      isFavorite: true
    },
    {
      id: 6,
      title: 'The Matrix',
      poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
      rating: 8.7,
      genre: 'Sci-Fi',
      year: 1999,
      isFavorite: true
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  removeFavorite(movie: Movie) {
    this.favoriteMovies = this.favoriteMovies.filter(m => m.id !== movie.id);
  }
}

