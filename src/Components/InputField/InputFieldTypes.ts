/**
 * Props for the InputField component.
 *
 * @interface InputFieldProps
 * @property {function} [onChange] - Optional event handler for handling input changes.
 * @param {React.ChangeEvent<HTMLInputElement>} event - The change event for the input element.
 * @property {boolean} isRequired - Indicates whether the input field is required.
 * @property {string} type - The type of the input (e.g., 'text', 'password', 'email').
 * @property {string} placeholder - The placeholder text displayed in the input field when it's empty.
 * @property {string} inputImg - The URL of the image to display next to the input field.
 * @property {boolean} isSpellCheck - Determines if spell check is enabled for the input field.
 * @property {string} [setWidth] - Optional custom width for the input field. Defaults to '100%'.
 * @property {string} [setMarginTop] - Optional custom margin-top for the input field. Defaults to '2%'.
 * @property {boolean} [isDisabled] - Optional boolean to disable the input field.
 * @property {boolean} [isPrimaryStyle] - Optional flag for applying primary or secondary styles to the input field. Defaults to true (primary style).
 * @property {string} [value] - Optional value for the input field.
 * @property {string} [name] - Optional name attribute for the input field.
 */
export interface InputFieldProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isRequired: boolean;
  type: string;
  placeholder: string;
  inputImg: string;
  isSpellCheck: boolean;
  setWidth?: string;
  setMarginTop?: string;
  isDisabled?: boolean;
  isPrimaryStyle?: boolean;
  value?: string;
  name?: string;
}