import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Error from './components/Error';
import Navbar from './components/Navbar';
import Personal from './components/Personal/Personal';
import './css/style.css';

const router = [
  {
    path: '/',
    element: <></>,
    errorElement: <Error/>,
    children: [
      {
        path: 'personal',
        element: <Personal/>
      },
      {
        path: 'cars',
        element: <Personal/>
      },
      {
        path: 'call',
        element: <Personal/>
      },
      {
        path: 'brigade',
        element: <Personal/>
      },
      {
        path: 'graph',
        element: <Personal/>
      },
      {
        path: 'statistic',
        element: <Personal/>
      },
    ]
  }
];

router[0].element = <Navbar data={router[0].children.map((data) => `/${data.path}`)}/>;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
//  <React.StrictMode>
    <RouterProvider router={createBrowserRouter(router)}/>
//  </React.StrictMode>
);
