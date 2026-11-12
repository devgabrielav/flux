import { useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import Header from '../components/Header';
import Summary from '../components/Summary';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchRates } from '../redux/walletSlice';

function Wallet() {
  const dispatch = useAppDispatch();
  const { ratesStatus, editingId } = useAppSelector((state) => state.wallet);

  useEffect(() => {
    dispatch(fetchRates());
  }, [dispatch]);

  return (
    <>
      <Header />
      <main className="container stack">
        {ratesStatus === 'error' && (
          <p className="alert" role="alert">
            Não foi possível atualizar as cotações. Usando as últimas conhecidas.
            {' '}
            <button
              type="button"
              className="link"
              onClick={ () => dispatch(fetchRates()) }
            >
              Tentar novamente
            </button>
          </p>
        )}
        <Summary />
        <ExpenseForm key={ editingId ?? 'new' } />
        <ExpenseList />
      </main>
    </>
  );
}

export default Wallet;
