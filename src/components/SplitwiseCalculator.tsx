"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser } from "@/lib/useUser";

interface Expense {
  id: string;
  payer: string;
  amount: number;
  description: string;
  date: string;
  splitAmong: string[];
}

interface Debt {
  from: string;
  to: string;
  amount: number;
}

const STORAGE_KEY = "china_trip_expenses";

function load(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(expenses: Expense[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {}
}

/** Simplify debts: calculate net balance per person, then settle with fewest transactions */
function settleDebts(expenses: Expense[], people: string[]): Debt[] {
  const balances = new Map<string, number>();
  people.forEach((p) => balances.set(p, 0));

  for (const exp of expenses) {
    if (exp.splitAmong.length === 0) continue;
    const share = exp.amount / exp.splitAmong.length;
    balances.set(
      exp.payer,
      (balances.get(exp.payer) || 0) + exp.amount
    );
    for (const person of exp.splitAmong) {
      balances.set(person, (balances.get(person) || 0) - share);
    }
  }

  const creditors: [string, number][] = [];
  const debtors: [string, number][] = [];

  for (const [person, balance] of balances) {
    if (balance > 0.01) creditors.push([person, balance]);
    else if (balance < -0.01) debtors.push([person, -balance]);
  }

  creditors.sort((a, b) => b[1] - a[1]);
  debtors.sort((a, b) => b[1] - a[1]);

  const result: Debt[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const [debtor, debtAmount] = debtors[i];
    const [creditor, creditAmount] = creditors[j];
    const settle = Math.min(debtAmount, creditAmount);

    if (settle > 0.01) {
      result.push({ from: debtor, to: creditor, amount: Math.round(settle) });
    }

    debtors[i] = [debtor, debtAmount - settle];
    creditors[j] = [creditor, creditAmount - settle];

    if (debtors[i][1] < 0.01) i++;
    if (creditors[j][1] < 0.01) j++;
  }

  return result;
}

export default function SplitwiseCalculator() {
  const { allUsers, user } = useUser();
  const people = useMemo(() => {
    const names = allUsers.map((u) => u.name);
    return names.length > 0 ? names : ["Участник 1"];
  }, [allUsers]);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newPayer, setNewPayer] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [splitAll, setSplitAll] = useState(true);
  const [splitSet, setSplitSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    setExpenses(load());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      save(expenses);
      if (!newPayer && user) setNewPayer(user.name);
    }
  }, [expenses, loaded]);

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

  const debts = useMemo(
    () => settleDebts(expenses, people),
    [expenses, people]
  );

  const balances = useMemo(() => {
    const map = new Map<string, number>();
    people.forEach((p) => map.set(p, 0));
    for (const exp of expenses) {
      if (exp.splitAmong.length === 0) continue;
      const share = exp.amount / exp.splitAmong.length;
      map.set(exp.payer, (map.get(exp.payer) || 0) + exp.amount);
      for (const person of exp.splitAmong) {
        map.set(person, (map.get(person) || 0) - share);
      }
    }
    return map;
  }, [expenses, people]);

  const addExpense = () => {
    const amount = parseFloat(newAmount);
    if (!amount || amount <= 0 || !newPayer) return;

    const split = splitAll ? [...people] : [...splitSet];
    if (split.length === 0) split.push(newPayer);

    const exp: Expense = {
      id: Date.now().toString(),
      payer: newPayer,
      amount,
      description: newDesc || "Расход",
      date: new Date().toLocaleDateString("ru-RU"),
      splitAmong: split,
    };
    setExpenses((prev) => [...prev, exp]);
    setNewAmount("");
    setNewDesc("");
    setShowAdd(false);
    setSplitSet(new Set());
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleSplit = (name: string) => {
    setSplitSet((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  if (!loaded) return null;

  return (
    <section id="splitwise" className="pt-28 -mt-16">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="font-display text-4xl md:text-5xl text-accent-black tracking-tight">
          ДОЛГИ
        </h2>
        <span className="font-mono text-xs text-accent-pink font-bold border-2 border-accent-pink px-2 py-0.5">
          SPLITWISE
        </span>
      </div>
      <p className="font-mono text-sm text-text-secondary mb-6">
        Общие расходы группы. Кто за что заплатил и кто кому должен.
      </p>

      {/* Summary */}
      <div className="brutal-card bg-accent-black text-bg-base p-5 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <div className="font-mono text-[10px] text-bg-base/50 tracking-wider">
              ВСЕГО ПОТРАЧЕНО
            </div>
            <div className="font-display text-2xl text-accent-pink">
              {totalSpent.toLocaleString()} ₽
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-bg-base/50 tracking-wider">
              РАСХОДОВ
            </div>
            <div className="font-display text-2xl">{expenses.length}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-bg-base/50 tracking-wider">
              УЧАСТНИКОВ
            </div>
            <div className="font-display text-2xl">{people.length}</div>
          </div>
        </div>
      </div>

      {/* Balances */}
      {people.length > 1 && (
        <div className="brutal-card p-4 mb-4">
          <h3 className="font-mono text-xs font-bold text-accent-black tracking-wider mb-3">
            БАЛАНСЫ
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {people.map((p) => {
              const bal = balances.get(p) || 0;
              return (
                <div
                  key={p}
                  className="border-2 border-accent-black p-2 text-center"
                >
                  <div className="font-mono text-[10px] text-text-muted truncate">
                    {p}
                  </div>
                  <div
                    className={`font-display text-lg ${
                      bal > 0.01
                        ? "text-green-600"
                        : bal < -0.01
                          ? "text-accent-pink"
                          : "text-accent-black"
                    }`}
                  >
                    {bal > 0 ? "+" : ""}
                    {Math.round(bal).toLocaleString()} ₽
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add expense form */}
      {showAdd ? (
        <div className="brutal-card p-5 mb-4">
          <h3 className="font-mono text-sm font-bold mb-4">НОВЫЙ РАСХОД</h3>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[150px]">
                <label className="font-mono text-[10px] text-text-muted block mb-1">
                  КТО ПЛАТИЛ
                </label>
                <select
                  value={newPayer}
                  onChange={(e) => setNewPayer(e.target.value)}
                  className="w-full p-2 border-2 border-accent-black font-mono text-sm bg-surface"
                >
                  {people.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-32">
                <label className="font-mono text-[10px] text-text-muted block mb-1">
                  СУММА ₽
                </label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="0"
                  className="w-full p-2 border-2 border-accent-black font-mono text-sm bg-surface"
                />
              </div>
            </div>
            <div>
              <label className="font-mono text-[10px] text-text-muted block mb-1">
                ОПИСАНИЕ
              </label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Отель, ужин, транспорт..."
                className="w-full p-2 border-2 border-accent-black font-mono text-sm bg-surface"
              />
            </div>
            {people.length > 1 && (
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <label className="font-mono text-[10px] text-text-muted flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={splitAll}
                      onChange={(e) => setSplitAll(e.target.checked)}
                      className="w-4 h-4 accent-accent-pink"
                    />
                    ДЕЛИТЬ НА ВСЕХ
                  </label>
                </div>
                {!splitAll && (
                  <div className="flex flex-wrap gap-2">
                    {people.map((p) => (
                      <button
                        key={p}
                        onClick={() => toggleSplit(p)}
                        className={`font-mono text-xs px-3 py-1 border-2 transition-colors ${
                          splitSet.has(p)
                            ? "bg-accent-pink text-white border-accent-pink"
                            : "border-accent-black hover:bg-bg-secondary"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={addExpense}
                className="font-mono text-xs font-bold bg-accent-black text-bg-base px-4 py-2 border-2 border-accent-black hover:bg-accent-pink hover:border-accent-pink transition-colors"
              >
                ДОБАВИТЬ
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="font-mono text-xs font-bold px-4 py-2 border-2 border-accent-black hover:bg-bg-secondary transition-colors"
              >
                ОТМЕНА
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="font-mono text-xs font-bold bg-accent-pink text-white px-4 py-2 border-2 border-accent-black mb-4 hover:bg-accent-black transition-colors"
        >
          + ДОБАВИТЬ РАСХОД
        </button>
      )}

      {/* Settled debts */}
      {debts.length > 0 && (
        <div className="brutal-card p-4 mb-4">
          <h3 className="font-mono text-xs font-bold text-accent-black tracking-wider mb-3">
            КТО КОМУ ДОЛЖЕН
          </h3>
          <div className="space-y-2">
            {debts.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-accent-black/20 pb-2 last:border-0"
              >
                <div className="flex items-center gap-3 font-mono text-sm">
                  <span className="font-bold text-accent-pink">{d.from}</span>
                  <span className="text-text-muted">→</span>
                  <span className="font-bold text-green-700">{d.to}</span>
                </div>
                <span className="font-display text-lg text-accent-black">
                  {d.amount.toLocaleString()} ₽
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense list */}
      {expenses.length > 0 ? (
        <div className="brutal-card overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-3 border-accent-black bg-bg-secondary">
                <th className="p-3 font-mono text-xs tracking-wider">ДАТА</th>
                <th className="p-3 font-mono text-xs tracking-wider">КТО</th>
                <th className="p-3 font-mono text-xs tracking-wider">
                  ОПИСАНИЕ
                </th>
                <th className="p-3 font-mono text-xs tracking-wider text-right">
                  СУММА
                </th>
                <th className="p-3 font-mono text-xs tracking-wider text-center">
                  ×
                </th>
              </tr>
            </thead>
            <tbody>
              {[...expenses].reverse().map((exp) => (
                <tr
                  key={exp.id}
                  className="border-b border-accent-black/20 hover:bg-bg-secondary transition-colors"
                >
                  <td className="p-3 font-mono text-xs text-text-muted">
                    {exp.date}
                  </td>
                  <td className="p-3 font-mono text-xs font-bold">
                    {exp.payer}
                  </td>
                  <td className="p-3 text-xs">
                    {exp.description}
                    <span className="font-mono text-[10px] text-text-muted block">
                      / {exp.splitAmong.length} чел.
                    </span>
                  </td>
                  <td className="p-3 font-mono text-sm font-bold text-right">
                    {exp.amount.toLocaleString()} ₽
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="font-mono text-xs text-accent-pink hover:text-red-600 font-bold"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="brutal-card p-8 text-center">
          <p className="font-mono text-sm text-text-muted">
            Расходов пока нет. Добавьте первый!
          </p>
        </div>
      )}
    </section>
  );
}
