/**
 * Represents a card with an image, title, and text.
 *
 * @interface Card
 * @property {number} key - A unique identifier for the card.
 * @property {string} cardImg - The URL of the card image.
 * @property {string} cardTitle - The title of the card.
 * @property {string} cardText - The description text of the card.
 */
export interface Card {
    key: number;
    cardImg: string;
    cardTitle: string;
    cardText: string;
}