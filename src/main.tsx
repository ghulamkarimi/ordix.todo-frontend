import { Provider } from 'react-redux';
import {  store } from './store';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom'; // <-- wichtig!

import './index.css';
import {  ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Nicht vergessen!
import router from './routes';


createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <ToastContainer />
  </Provider>
);
