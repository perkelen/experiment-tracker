import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [experiments, setExperiments] = useState([]);
  const [newExperiment, setNewExperiment] = useState({ name: '', status: 'План' });
  const [filterStatus, setFilterStatus] = useState('Все');

  // загрузка из localStorage при монтировании
  useEffect(() => {
    const saved = localStorage.getItem('experiments');
    if (saved) {
      setExperiments(JSON.parse(saved));
    }
  }, []);

  // сохранение в localStorage при изменении experiments
  useEffect(() => {
    localStorage.setItem('experiments', JSON.stringify(experiments));
  }, [experiments]);

  // добавление эксперимента
  const addExperiment = () => {
    if (!newExperiment.name.trim()) {
      alert('Введите название эксперимента');
      return;
    }
    const experiment = {
      id: Date.now(),
      name: newExperiment.name,
      status: newExperiment.status,
    };
    setExperiments([...experiments, experiment]);
    setNewExperiment({ name: '', status: 'План' });
  };

  // удаление эксперимента
  const deleteExperiment = (id) => {
    setExperiments(experiments.filter(exp => exp.id !== id));
  };

  // обновление статуса
  const updateStatus = (id, newStatus) => {
    setExperiments(experiments.map(exp =>
      exp.id === id ? { ...exp, status: newStatus } : exp
    ));
  };

  // фильтрация
  const filteredExperiments = filterStatus === 'Все'
    ? experiments
    : experiments.filter(exp => exp.status === filterStatus);

  // подсчёт завершённых
  const completedCount = experiments.filter(exp => exp.status === 'Завершён').length;

  return (
    <div className="container">
      <h1>🧪 Учёт экспериментов</h1>

      {/* форма добавления */}
      <div className="add-form">
        <input
          type="text"
          placeholder="Название эксперимента"
          value={newExperiment.name}
          onChange={(e) => setNewExperiment({ ...newExperiment, name: e.target.value })}
        />
        <select
          value={newExperiment.status}
          onChange={(e) => setNewExperiment({ ...newExperiment, status: e.target.value })}
        >
          <option>План</option>
          <option>В процессе</option>
          <option>Завершён</option>
        </select>
        <button onClick={addExperiment}>➕ Добавить</button>
      </div>

      {/* фильтр и счётчик */}
      <div className="filter-bar">
        <div className="filter">
          <label>Фильтр по статусу: </label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option>Все</option>
            <option>План</option>
            <option>В процессе</option>
            <option>Завершён</option>
          </select>
        </div>
        <div className="counter">
          ✅ Завершённых экспериментов: <strong>{completedCount}</strong>
        </div>
      </div>

      {/* список экспериментов */}
      <ul className="experiment-list">
        {filteredExperiments.length === 0 ? (
          <li className="empty">Нет экспериментов</li>
        ) : (
          filteredExperiments.map(exp => (
            <li key={exp.id} className="experiment-item">
              <span className="exp-name">{exp.name}</span>
              <select
                value={exp.status}
                onChange={(e) => updateStatus(exp.id, e.target.value)}
                className={`status-select status-${exp.status === 'План' ? 'plan' : exp.status === 'В процессе' ? 'progress' : 'done'}`}
              >
                <option>План</option>
                <option>В процессе</option>
                <option>Завершён</option>
              </select>
              <button onClick={() => deleteExperiment(exp.id)} className="delete-btn">
                🗑️
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default App;
