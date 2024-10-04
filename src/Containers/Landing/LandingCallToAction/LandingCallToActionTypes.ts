/**
 * Props for the LandingCallToAction component.
 *
 * @interface LandingCallToActionProps
 * @property {function} HandleManageDevicesClick - A function to handle the click event for managing devices.
 * @property {function} HandleShopClick - The function to handle clicks for shopping.
 */
export interface LandingCallToActionProps{
    HandleManageDevicesClick: () => void;
    HandleShopClick: () => void;
}