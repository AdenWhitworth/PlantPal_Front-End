/**
 * Props for the LoginForm component.
 *
 * @interface LoginFormProps
 * @property {function} handleReturnHome - Function to navigate back to the home page.
 * @property {function} handleReturnForgotPassword - Function to navigate to the forgot password page.
 * @property {function} handleInputChange - Function to handle changes in input fields.
 * @property {string | null} error - Error message to display, or null if there is no error.
 * @property {function} handleSubmit - Function to handle form submission.
 * @property {boolean} isLoading - Indicates if the form is in a loading state (e.g., during submission).
 */
export interface LoginFormProps {
    handleReturnHome: () => void;
    handleReturnForgotPassword: () => void;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
}
