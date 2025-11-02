/**
 * Category Model
 *
 * Represents a movie category with display metadata for the UI.
 * This extends the basic Genre information with visual presentation data.
 *
 * Used in:
 * - CategoryPage: To display movie categories with icons and colors
 * - HomePage: For category navigation and filtering
 *
 * @interface Category
 */
export interface Category {
    /** Unique identifier for the category (matches TMDB genre ID) */
    id: number;

    /** Display name of the category */
    name: string;

    /** Icon identifier for visual representation */
    icon: string;

    /** Description of the category */
    description: string;

    /** Color code for the category card/tile (hex format) */
    color: string;
}
