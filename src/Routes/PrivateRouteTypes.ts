/**
 * Props for the PrivateRoute component.
 *
 * @interface PrivateRouteProps
 * @property {JSX.Element} children - The content to be rendered within the private route. 
 * This should be a valid JSX element representing the component or elements that 
 * are only accessible to authenticated users.
 */
export interface PrivateRouteProps {
    children: JSX.Element;
}
  