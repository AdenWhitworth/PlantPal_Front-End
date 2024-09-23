/**
 * Props for the SignUpForm component.
 * 
 * @interface SignUpFormProps
 * @property {Function} handleReturnHome - Function to navigate back to the home page.
 * @property {Function} handleInputChange - Function to handle changes to input fields.
 * @property {string|null} error - Error message to display, if any; otherwise, null.
 * @property {Function} handleSubmit - Function to handle form submission.
 * @property {boolean} isLoading - Indicates whether the form is in a loading state.
 */
export interface SignUpFormProps {
    handleReturnHome: () => void;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
}