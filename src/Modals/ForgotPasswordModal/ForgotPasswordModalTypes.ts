/**
 * Props for the ForgotPasswordModal component.
 * 
 * @interface ForgotPasswordModalProps
 * @property {function} handleReturnHome - Callback function to navigate the user back to the home page.
 * @property {string|null} message - Optional message to display in the modal, can be null if no message is provided.
 * @property {string|null} error - Optional error message to display in the modal, can be null if there are no errors.
 * @property {function} handleInputChange - Callback function to handle changes to the input field.
 * @property {function} handleSubmit - Callback function to handle form submission.
 */
export interface ForgotPasswordModalProps {
    handleReturnHome: () => void;
    message: string | null;
    error: string | null;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}
