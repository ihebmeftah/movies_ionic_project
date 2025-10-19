import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Category {
  id: number;
  name: string;
  icon: string;
  image: string;
  description: string;
  movieCount: number;
  color: string;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: false,
})
export class CategoryPage implements OnInit {
  searchQuery: string = '';
  selectedCategoryName: string = '';

  categories: Category[] = [
    {
      id: 1,
      name: 'Action',
      icon: 'flash',
      image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      description: 'Explosive thrills and intense sequences',
      movieCount: 245,
      color: '#FF6B6B'
    },
    {
      id: 2,
      name: 'Comedy',
      icon: 'happy',
      image: 'https://image.tmdb.org/t/p/w500/xvx4Yhf0DVH8G4LzNISpMfFBDy2.jpg',
      description: 'Laugh out loud with the funniest films',
      movieCount: 189,
      color: '#FFD93D'
    },
    {
      id: 3,
      name: 'Drama',
      icon: 'film',
      image: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
      description: 'Powerful stories and emotional journeys',
      movieCount: 312,
      color: '#6C5CE7'
    },
    {
      id: 4,
      name: 'Horror',
      icon: 'skull',
      image: 'https://image.tmdb.org/t/p/w500/vzmL6fP7aPKNKPRTFnZmiUfciyV.jpg',
      description: 'Spine-chilling tales and scary moments',
      movieCount: 156,
      color: '#2D3436'
    },
    {
      id: 5,
      name: 'Sci-Fi',
      icon: 'rocket',
      image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      description: 'Explore futuristic worlds and technology',
      movieCount: 198,
      color: '#00B894'
    },
    {
      id: 6,
      name: 'Romance',
      icon: 'heart',
      image: 'https://image.tmdb.org/t/p/w500/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg',
      description: 'Love stories that touch your heart',
      movieCount: 167,
      color: '#FD79A8'
    },
    {
      id: 7,
      name: 'Thriller',
      icon: 'eye',
      image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
      description: 'Suspenseful plots that keep you guessing',
      movieCount: 234,
      color: '#0984E3'
    },
    {
      id: 8,
      name: 'Animation',
      icon: 'color-palette',
      image: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      description: 'Animated adventures for all ages',
      movieCount: 143,
      color: '#FF7675'
    },
    {
      id: 9,
      name: 'Adventure',
      icon: 'compass',
      image: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
      description: 'Epic quests and exciting expeditions',
      movieCount: 221,
      color: '#FDCB6E'
    },
    {
      id: 10,
      name: 'Fantasy',
      icon: 'sparkles',
      image: 'https://image.tmdb.org/t/p/w500/6EiRUJpuoeQPghrs3YNd6Y2kLdt.jpg',
      description: 'Magical worlds and mythical creatures',
      movieCount: 176,
      color: '#A29BFE'
    },
    {
      id: 11,
      name: 'Crime',
      icon: 'finger-print',
      image: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      description: 'Criminal masterminds and investigations',
      movieCount: 187,
      color: '#636E72'
    },
    {
      id: 12,
      name: 'Documentary',
      icon: 'videocam',
      image: 'https://image.tmdb.org/t/p/w500/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
      description: 'Real stories from the real world',
      movieCount: 124,
      color: '#74B9FF'
    }
  ];

  filteredCategories: Category[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // Get the category name from query parameters
    this.route.queryParams.subscribe(params => {
      this.selectedCategoryName = params['categoryname'] || '';

      if (this.selectedCategoryName) {
        // Filter categories to show only the selected one
        this.filteredCategories = this.categories.filter(category =>
          category.name.toLowerCase() === this.selectedCategoryName
        );
      } else {
        // Show all categories if no specific category is selected
        this.filteredCategories = [...this.categories];
      }
    });
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    const baseCategories = this.selectedCategoryName ?
      this.categories.filter(category => category.name.toLowerCase() === this.selectedCategoryName) :
      this.categories;

    if (query.trim() === '') {
      this.filteredCategories = [...baseCategories];
    } else {
      this.filteredCategories = baseCategories.filter(category =>
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
      );
    }
  }

  selectCategory(category: Category) {
    console.log('Selected category:', category);
    // Navigate to movies filtered by this category
  }

}
