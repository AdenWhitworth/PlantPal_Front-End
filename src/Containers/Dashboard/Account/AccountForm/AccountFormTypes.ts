/**
 * Props for the AccountForm component.
 * 
 * @interface AccountFormProps
 * @property {Function} handleReturnForgotPassword - Function to navigate to the forgot password screen.
 * @property {Function} handleInputChange - Function to handle input field changes.
 * @property {string|null} error - Error message to display or null if there are no errors.
 * @property {Function} handleSaveClick - Function to handle the form submission for saving changes.
 * @property {Function} handleEditClick - Function to toggle edit mode for the form.
 * @property {boolean} editToggle - Indicates if the form is in edit mode.
 * @property {boolean} inputDisabled - Indicates if the input fields should be disabled.
 * @property {Function} handleCloseClick - Function to close the account form.
 */
export interface AccountFormProps {
    handleReturnForgotPassword: () => void;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
    handleSaveClick: (event: React.FormEvent<HTMLFormElement>) => void;
    handleEditClick: () => void;
    editToggle: boolean;
    inputDisabled: boolean;
    handleCloseClick: () => void;
}