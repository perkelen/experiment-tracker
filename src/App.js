import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './logo.svg'; // ← импорт вашего логотипа

const App = () => {
  const [experiments, setExperiments] = useState([]);
  const [newExperiment, setNewExperiment] = useState({ name: '', status: 'План' });
  const [filterStatus, setFilterStatus] = useState('Все');

  // Загрузка из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('experiments');
    if (saved) {
      setExperiments(JSON.parse(saved));
    }
  }, []);

  // Сохранение в localStorage
  useEffect(() => {
    localStorage.setItem('experiments', JSON.stringify(experiments));
  }, [experiments]);

  // Добавление эксперимента
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

  // Удаление эксперимента
  const deleteExperiment = (id) => {
    setExperiments(experiments.filter(exp => exp.id !== id));
  };

  // Обновление статуса
  const updateStatus = (id, newStatus) => {
    setExperiments(experiments.map(exp =>
      exp.id === id ? { ...exp, status: newStatus } : exp
    ));
  };

  // Фильтрация
  const filteredExperiments = filterStatus === 'Все'
    ? experiments
    : experiments.filter(exp => exp.status === filterStatus);

  // Подсчёт завершённых
  const completedCount = experiments.filter(exp => exp.status === 'Завершён').length;

  return (
    <div className="container">
      <div className="header">
        <img src={logo} className="app-logo" alt="logo" />
        <h1>🧪 Учёт экспериментов</h1>
      </div>

      {/* Форма добавления */}
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

      {/* Фильтр и счётчик */}
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

      {/* Список экспериментов */}
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
