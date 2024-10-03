/**
 * Props for the EditWifiForm component.
 * 
 * @interface EditWifiFormProps
 * @property {function} handleUpdateWifiSubmit - Function to handle form submission for updating Wi-Fi settings.
 * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
 * 
 * @property {function} handleInputChange - Function to handle changes in input fields.
 * @param {React.ChangeEvent<HTMLInputElement>} event - The change event for the input element.
 * 
 * @property {string | null} error - Error message to display, or null if there is no error.
 * @property {boolean} connectionLoading - Connection loading state to control loading UI
 * @property {function} handleCloseClick - Close the edit wifi form
 */
export interface EditWifiFormProps {
    handleUpdateWifiSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
    connectionLoading: boolean;
    handleCloseClick: () => void;
}