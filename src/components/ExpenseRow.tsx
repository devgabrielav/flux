import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import type { Expense } from '../types';
import { formatMoney, toBRL } from '../utils';

type Props = {
  expense: Expense,
  onEdit: (id: number) => void,
  onRemove: (id: number) => void,
};

function ExpenseRow({ expense, onEdit, onRemove }: Props) {
  const { id, description, tag, method, value, currency } = expense;
  return (
    <tr>
      <td data-label="Descrição" className="table__title">{description}</td>
      <td data-label="Categoria"><span className="chip">{tag}</span></td>
      <td data-label="Pagamento">{method}</td>
      <td data-label="Valor" className="num" title={ expense.currencyName }>
        {formatMoney(value, currency)}
      </td>
      <td data-label="Câmbio" className="num" title={ expense.currencyName }>
        {expense.currencyName || currency || 'Real Brasileiro'}
      </td>
      <td data-label="Em reais" className="num table__strong">
        {formatMoney(toBRL(expense))}
      </td>
      <td className="table__actions">
        <button
          type="button"
          className="btn btn--icon"
          data-testid="edit-btn"
          aria-label={ `Editar ${description}` }
          onClick={ () => onEdit(id) }
        >
          <FiEdit2 />
        </button>
        <button
          type="button"
          className="btn btn--icon btn--danger"
          data-testid="delete-btn"
          aria-label={ `Excluir ${description}` }
          onClick={ () => onRemove(id) }
        >
          <FiTrash2 />
        </button>
      </td>
    </tr>
  );
}

export default ExpenseRow;
