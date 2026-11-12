import { useMemo } from 'react';
import { BASE_CURRENCY } from '../constants';
import { setDisplayCurrency } from '../redux/walletSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { formatMoney, toBRL } from '../utils';

function Summary() {
  const dispatch = useAppDispatch();
  const { expenses, rates, displayCurrency } = useAppSelector((state) => state.wallet);

  // Converte o total (em BRL) para a moeda escolhida, se houver cotação.
  const target = rates[displayCurrency] ? displayCurrency : BASE_CURRENCY;
  const divisor = rates[target]?.ask ?? 1;

  const { total, categories } = useMemo(() => {
    const byTag = new Map<string, number>();
    expenses.forEach((expense) => {
      byTag.set(expense.tag, (byTag.get(expense.tag) ?? 0) + toBRL(expense) / divisor);
    });
    const sorted = [...byTag.entries()].sort((a, b) => b[1] - a[1]);
    const sum = sorted.reduce((acc, [, value]) => acc + value, 0);
    return { total: sum, categories: sorted };
  }, [expenses, divisor]);

  return (
    <section className="card summary" aria-label="Resumo">
      <div className="summary__main">
        <p className="eyebrow">Total de despesas</p>
        <p className="summary__total" data-testid="total-field">
          {formatMoney(total, target)}
        </p>
        <label className="field field--inline">
          <span>Exibir em</span>
          <select
            value={ target }
            onChange={ (event) => dispatch(setDisplayCurrency(event.target.value)) }
            data-testid="header-currency-field"
          >
            {Object.keys(rates).sort().map((code) => (
              <option key={ code } value={ code }>{code}</option>
            ))}
            {!rates[target] && <option value={ target }>{target}</option>}
          </select>
        </label>
      </div>
      <div className="summary__cats">
        <p className="eyebrow">
          Por categoria ·
          {expenses.length}
          {' '}
          despesa(s)
        </p>
        {categories.length === 0 && <p className="muted">Sem dados ainda.</p>}
        {categories.map(([tag, value]) => (
          <div className="bar" key={ tag }>
            <div className="bar__label">
              <span>{tag}</span>
              <span>{formatMoney(value, target)}</span>
            </div>
            <div className="bar__track">
              <div
                className="bar__fill"
                style={ { width: `${total > 0 ? (value / total) * 100 : 0}%` } }
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Summary;
