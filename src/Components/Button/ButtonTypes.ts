import { ReactNode, MouseEventHandler } from 'react';

/**
 * Props for the Button component.
 *
 * @interface ButtonProps
 * @property {ReactNode} children - The content to be rendered inside the button, usually text or elements.
 * @property {'primary' | 'secondary' | 'tertiary'} styleType - The style type of the button, determining its visual appearance.
 *     - 'primary': A hollow button with a growing effect.
 *     - 'secondary': A filled button with a growing effect.
 *     - 'tertiary': A text-only button.
 * @property {function} [onClick] - The function to call when the button is clicked. Optional.
 * @param {React.MouseEvent<HTMLButtonElement>} event - The mouse event object.
 * @property {'button' | 'submit' | 'reset'} [type] - The button type, which determines the action type. Default is 'button'.
 *     - 'button': The default push button.
 *     - 'submit': Submits a form.
 *     - 'reset': Resets a form.
 * @property {string} [className] - Additional class names to apply to the button. Optional.
 * @property {boolean} [disabled] - Whether the button is disabled. If true, the button will be inactive. Default is false.
 * @property {string} [testId] - Test identifier for selecting the button in tests. Optional.
 */
export interface ButtonProps {
    children: ReactNode;
    styleType: 'primary' | 'secondary' | 'tertiary';
    onClick?: MouseEventHandler<HTMLButtonElement>;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
    testId?: string;
}