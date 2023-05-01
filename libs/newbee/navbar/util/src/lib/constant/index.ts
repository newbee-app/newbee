/**
 * All of the possible keywords representing routes.
 */
export enum RouteKeyword {
  Home = 'Home',
  Features = 'Features',
  Guides = 'Guides',
  Pricing = 'Pricing',
  Login = 'Login',
  Register = 'Register',
  Account = 'Account',
  CreateDoc = 'CreateDoc',
  CreateQna = 'CreateQna',
}

/**
 * A constant mapping keywords to routes.
 */
export const keywordToRoute: { [key in RouteKeyword]: string } = {
  Home: '/',
  Features: '/features',
  Guides: '/guides',
  Pricing: '/pricing',
  Login: '/auth/login',
  Register: '/auth/register',
  Account: '/account',
  CreateDoc: '/doc/create',
  CreateQna: '/qna/create',
};

/**
 * All of the routes to include in the unauthenticated navbar.
 */
export const unauthenticatedNavbarRoutes: RouteKeyword[] = [
  RouteKeyword.Features,
  RouteKeyword.Guides,
  RouteKeyword.Pricing,
];
