import { Component, OnInit } from '@angular/core';

interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  genre: string;
  year: number;
  duration: string;
  description: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.page.html',
  styleUrls: ['./movies-list.page.scss'],
  standalone: false,
})
export class MoviesListPage implements OnInit {
  searchQuery: string = '';

  moviesList: Movie[] = [
    {
      id: 1,
      title: 'Inception',
      poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      rating: 8.8,
      genre: 'Sci-Fi',
      year: 2010,
      duration: '2h 28min',
      description: 'A thief who steals corporate secrets through dream-sharing technology.',
      isFavorite: false
    },
    {
      id: 2,
      title: 'The Dark Knight',
      poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      rating: 9.0,
      genre: 'Action',
      year: 2008,
      duration: '2h 32min',
      description: 'Batman faces the Joker, a criminal mastermind in Gotham City.',
      isFavorite: false
    },
    {
      id: 3,
      title: 'Interstellar',
      poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      rating: 8.6,
      genre: 'Sci-Fi',
      year: 2014,
      duration: '2h 49min',
      description: 'A team of explorers travel through a wormhole in space.',
      isFavorite: true
    },
    {
      id: 4,
      title: 'Pulp Fiction',
      poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
      rating: 8.9,
      genre: 'Crime',
      year: 1994,
      duration: '2h 34min',
      description: 'Various interconnected stories of criminals in Los Angeles.',
      isFavorite: false
    },
    {
      id: 5,
      title: 'The Shawshank Redemption',
      poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      rating: 9.3,
      genre: 'Drama',
      year: 1994,
      duration: '2h 22min',
      description: 'Two imprisoned men bond over years, finding redemption.',
      isFavorite: true
    },
  ];

  constructor() { }

  ngOnInit() {
  }

  toggleFavorite(movie: Movie) {
    movie.isFavorite = !movie.isFavorite;
  }
}

