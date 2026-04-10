import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './logo.svg';

const App = () => {
  const [experiments, setExperiments] = useState([]);
  const [newExperiment, setNewExperiment] = useState({ name: '', status: 'План' });
  const [filterStatus, setFilterStatus] = useState('Все');

  useEffect(() => {
    const saved = localStorage.getItem('experiments');
    if (saved) {
      setExperiments(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('experiments', JSON.stringify(experiments));
  }, [experiments]);

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

  const deleteExperiment = (id) => {
    setExperiments(experiments.filter(exp => exp.id !== id));
  };

  const updateStatus = (id, newStatus) => {
    setExperiments(experiments.map(exp =>
      exp.id === id ? { ...exp, status: newStatus } : exp
    ));
  };

  const filteredExperiments = filterStatus === 'Все'
    ? experiments
    : experiments.filter(exp => exp.status === filterStatus);

  const completedCount = experiments.filter(exp => exp.status === 'Завершён').length;

  return (
    <div className="container">
      <div className="header">
        <img src={logo} className="app-logo" alt="logo" />
        <h1>учёт экспериментов</h1>
      </div>

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
        <button onClick={addExperiment}>Добавить</button>
      </div>

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
