import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { auth } from './auth';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Wallet from './pages/Wallet';
import { applyUser } from './redux';
import { useAppDispatch } from './redux/hooks';

function App() {
  const dispatch = useAppDispatch();

  // Mantém o Redux sincronizado com a sessão (inclusive expiração/logout em outra aba).
  useEffect(() => {
    let active = true;
    auth.getUser()
      .then((user) => active && dispatch(applyUser(user)))
      .catch(() => active && dispatch(applyUser(null)));
    const unsubscribe = auth.onChange((user) => dispatch(applyUser(user)));
    return () => {
      active = false;
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={ <Login /> } />
      <Route element={ <ProtectedRoute /> }>
        <Route path="/carteira" element={ <Wallet /> } />
      </Route>
      <Route path="*" element={ <Navigate to="/" replace /> } />
    </Routes>
  );
}

export default App;
