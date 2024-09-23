/**
 * Represents the state of water status with associated metadata.
 * 
 * @interface WaterStatusState
 * @property {string} text - The text description of the water status.
 * @property {string} cssClass - The CSS class to apply for styling the water status.
 * @property {string} imgSrc - The source URL of the image representing the water status.
 * @property {string} imgAlt - The alternative text for the image, for accessibility.
 */
export interface WaterStatusState {
    text: string;
    cssClass: string;
    imgSrc: string;
    imgAlt: string;
}
