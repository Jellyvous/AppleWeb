import Homepage from "../pages/HomePage/Homepage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import Cart from "../pages/Cart/Cart";
export const routes = [
  {
    path: '/',
    page: Homepage,
    isNavbar: true
  },
  {
    path: '/order',
    page: OrderPage,
    isNavbar: true
  },
  {
    path: '/products',
    page: ProductsPage,
    isNavbar: true
  },
  {
    path: '/SignIn',
    page: SignInPage,
    isNavbar: false
  },
  {
    path: '/SignUp',
    page: SignUpPage,
    isNavbar: false
  },
  {
    path: '*',
    page: NotFoundPage
  },
  {
    path: '/Cart',
    page: Cart,
    isNavbar: false
  }
]
