/**
 * Represents a link item with its properties.
 *
 * @interface Link
 * @property {number} key - A unique identifier for the link.
 * @property {string} alt - The alt text for the link's image.
 * @property {string} imgSrc - The source URL of the link's image.
 * @property {function} onClick - The function to be called when the link is clicked.
 * @property {string} className - The CSS class name for styling the link.
 */
export interface Link {
    key: number;
    alt: string;
    imgSrc: string;
    onClick: () => void;
    className: string;
}

/**
 * Props for the DashboardHeader component.
 *
 * @interface LandingHeaderProps
 * @property {function} HandleManageDevicesClick - The function to handle clicks for managing devices.
 * @property {function} HandleShopClick - The function to handle clicks for shopping.
 */
export interface LandingHeaderProps {
    HandleManageDevicesClick: () => void;
    HandleShopClick: () => void;
}