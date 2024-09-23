/**
 * Props for the AddDeviceForm component.
 * 
 * @interface AddDeviceFormProps
 * @property {function} handleInputChange - Callback function to handle changes in input fields.
 * @property {string|null} error - Error message to display, or null if there is no error.
 * @property {function} handleConnectClick - Callback function to handle the form submission.
 */
export interface AddDeviceFormProps {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
    handleConnectClick: (event: React.FormEvent<HTMLFormElement>) => void;
}