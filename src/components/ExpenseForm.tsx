import { ChangeEvent, FormEvent, useState } from 'react';
import { FiPlus, FiSave } from 'react-icons/fi';
import { METHODS, TAGS } from '../constants';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { cancelEdit, saveExpense } from '../redux/walletSlice';
import type { ExpenseDraft } from '../types';
import { isValidAmount } from '../utils';

const EMPTY: ExpenseDraft = {
  value: '', currency: 'USD', method: METHODS[0], tag: TAGS[0], description: '',
};

// Use com key={editingId ?? 'new'} para reiniciar o formulário ao trocar de despesa.
function ExpenseForm() {
  const dispatch = useAppDispatch();
  const { rates, expenses, editingId } = useAppSelector((state) => state.wallet);
  const editing = expenses.find(({ id }) => id === editingId);

  const [draft, setDraft] = useState<ExpenseDraft>(() => (editing
    ? { ...editing, value: String(editing.value) }
    : EMPTY));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const codes = Object.keys(rates).sort();
  const currencies = codes.length > 0 ? codes : [draft.currency];

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setDraft((previous) => ({ ...previous, [name]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isValidAmount(draft.value)) return setError('Informe um valor maior que zero.');
    if (!draft.description.trim()) return setError('Informe uma descrição.');
    setError('');
    setBusy(true);
    const saved = await dispatch(saveExpense(draft));
    setBusy(false);
    if (!saved) {
      setError('Não foi possível obter a cotação. Verifique a conexão e tente de novo.');
    } else if (!editing) {
      setDraft({ ...draft, value: '', description: '' });
    }
  };

  return (
    <form className="card form" onSubmit={ submit } noValidate>
      <h2 className="card__title">{editing ? 'Editar despesa' : 'Nova despesa'}</h2>
      <div className="form__grid">
        <label className="field field--wide">
          <span>Descrição</span>
          <input
            name="description"
            data-testid="description-input"
            value={ draft.description }
            onChange={ handleChange }
            placeholder="Ex.: Almoço com o time"
            maxLength={ 80 }
          />
        </label>
        <label className="field">
          <span>Valor</span>
          <input
            name="value"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            data-testid="value-input"
            value={ draft.value }
            onChange={ handleChange }
            placeholder="0,00"
          />
        </label>
        <label className="field">
          <span>Moeda</span>
          <select
            name="currency"
            data-testid="currency-input"
            value={ draft.currency }
            onChange={ handleChange }
          >
            {currencies.map((code) => (
              <option key={ code } value={ code }>{code}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Pagamento</span>
          <select
            name="method"
            data-testid="method-input"
            value={ draft.method }
            onChange={ handleChange }
          >
            {METHODS.map((method) => <option key={ method }>{method}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Categoria</span>
          <select
            name="tag"
            data-testid="tag-input"
            value={ draft.tag }
            onChange={ handleChange }
          >
            {TAGS.map((tag) => <option key={ tag }>{tag}</option>)}
          </select>
        </label>
      </div>
      {error && <p className="alert" role="alert">{error}</p>}
      <div className="form__actions">
        {editing && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={ () => dispatch(cancelEdit()) }
          >
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn--primary" disabled={ busy }>
          {editing ? <FiSave aria-hidden="true" /> : <FiPlus aria-hidden="true" />}
          {editing ? 'Salvar alterações' : 'Adicionar despesa'}
        </button>
      </div>
    </form>
  );
}

export default ExpenseForm;
