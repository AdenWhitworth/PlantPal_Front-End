/**
 * Props for the AuthSelection component.
 * 
 * @interface AuthSelectionProps
 * @property {boolean} isLoginSelected - Indicates whether the login option is selected (true) or the sign-up option is selected (false).
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsLoginSelected - Function to toggle between the login and sign-up selection.
 */
export interface AuthSelectionProps {
    isLoginSelected: boolean;
    setIsLoginSelected: React.Dispatch<React.SetStateAction<boolean>>;
}