import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Genre } from '../services/categories.service';

interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
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

  categories: Category[] = [];
  filteredCategories: Category[] = [];

  // Default color palette for categories
  private colorPalette = [
    '#FF6B6B', '#FFD93D', '#6C5CE7', '#2D3436', '#00B894',
    '#FD79A8', '#0984E3', '#FF7675', '#FDCB6E', '#A29BFE',
    '#636E72', '#74B9FF', '#55EFC4', '#FFEAA7', '#DFE6E9',
    '#B2BEC3', '#F368E0', '#48DBFB', '#FF9FF3', '#54A0FF'
  ];

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit() {
    // Fetch categories from TMDB API
    this.loadCategories();

    // Get the category name from query parameters
    this.route.queryParams.subscribe(params => {
      this.selectedCategoryName = params['categoryname'] || '';
      this.applyFilters();
    });
  }

  /**
   * Load categories from TMDB API
   */
  private loadCategories() {
    this.categoriesService.getMovieCategories().subscribe({
      next: (response) => {
        console.log('Categories loaded from TMDB:', response.genres);

        // Map API data to category format with dynamic colors
        this.categories = response.genres.map((genre, index) => {
          return {
            id: genre.id,
            name: genre.name,
            icon: 'film-outline',
            description: `Explore ${genre.name} movies`,
            color: this.colorPalette[index % this.colorPalette.length]
          };
        });

        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Fallback to empty array or show error message
        this.categories = [];
        this.filteredCategories = [];
      }
    });
  }

  /**
   * Apply filters based on selected category
   */
  private applyFilters() {
    if (this.selectedCategoryName) {
      // Filter categories to show only the selected one
      this.filteredCategories = this.categories.filter(category =>
        category.name.toLowerCase() === this.selectedCategoryName.toLowerCase()
      );
    } else {
      // Show all categories if no specific category is selected
      this.filteredCategories = [...this.categories];
    }
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
