// ** Router Components
import { BrowserRouter as AppRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../views/home';

const Router = () => {
  return (
    <AppRouter basename={process.env.REACT_APP_BASENAME}>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
      </Routes>
    </AppRouter>
  );
};

export default Router;
