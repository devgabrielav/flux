import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { expenseRemoved, startEdit } from '../redux/walletSlice';
import ExpenseRow from './ExpenseRow';

function ExpenseList() {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.wallet.expenses);

  const edit = (id: number) => {
    dispatch(startEdit(id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = (id: number) => {
    if (window.confirm('Excluir esta despesa?')) dispatch(expenseRemoved(id));
  };

  if (expenses.length === 0) {
    return (
      <section className="card empty">
        <p>Nenhuma despesa por aqui ainda.</p>
        <p className="muted">Adicione a primeira no formulário acima.</p>
      </section>
    );
  }

  return (
    <section className="card table-card" aria-label="Despesas">
      <table className="table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Pagamento</th>
            <th className="num">Valor</th>
            <th className="num">Câmbio</th>
            <th className="num">Em reais</th>
            <th aria-label="Ações" />
          </tr>
        </thead>
        <tbody>
          {[...expenses].reverse().map((expense) => (
            <ExpenseRow
              key={ expense.id }
              expense={ expense }
              onEdit={ edit }
              onRemove={ remove }
            />
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ExpenseList;
