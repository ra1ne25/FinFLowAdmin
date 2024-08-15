import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from './firebase';
import 'bootstrap/dist/css/bootstrap.min.css';

function ManageStores() {
  const [stores, setStores] = useState([]);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreNumber, setNewStoreNumber] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.backgroundColor = '#343a40'; // Устанавливаем цвет подложки для всего body
    document.body.style.color = '#FFFFFF'; // Устанавливаем белый цвет текста

    const fetchStores = async () => {
      const querySnapshot = await getDocs(collection(db, "stores"));
      const storesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      storesData.sort((a, b) => a.number - b.number); // Сортируем по номеру магазина
      setStores(storesData);
    };
    fetchStores();

    // Очистка стилей при размонтировании компонента
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, []);

  const handleAddStore = async (e) => {
    e.preventDefault();
    if (!newStoreName || !newStoreNumber) {
      setError('Both fields are required');
      return;
    }

    const existingStore = stores.find(store => store.number === Number(newStoreNumber));
    if (existingStore) {
      setError(`Store with number ${newStoreNumber} already exists!`);
      return;
    }

    try {
      await addDoc(collection(db, "stores"), {
        name: newStoreName,
        number: Number(newStoreNumber)
      });
      const updatedStores = [...stores, { name: newStoreName, number: Number(newStoreNumber) }];
      updatedStores.sort((a, b) => a.number - b.number); // Сортируем по номеру магазина
      setStores(updatedStores);
      setNewStoreName('');
      setNewStoreNumber('');
      setError('');
    } catch (error) {
      console.error('Error adding store:', error);
      setError('Error adding store. Please try again.');
    }
  };

  const handleDeleteStore = async (storeId) => {
    try {
      await deleteDoc(doc(db, "stores", storeId));
      const updatedStores = stores.filter(store => store.id !== storeId);
      setStores(updatedStores);
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-light" style={{
        textAlign: 'left', // Выравнивание заголовка слева
        fontSize: '24px', // Средний размер текста
        fontWeight: 'bold', // Жирный текст
        paddingLeft: '10px', // Отступ слева
        borderLeft: '4px solid #007bff', // Синяя линия слева для акцента
        paddingBottom: '10px', // Отступ снизу
        marginBottom: '20px', // Отступ снизу для отделения заголовка
        color: '#ffffff', // Цвет текста
      }}>
        Управление магазинами
      </h1>
      <form onSubmit={handleAddStore} className="p-4 rounded shadow-sm" style={{ backgroundColor: '#2f2f2f', border: '1px solid #444', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
        <div className="form-group mb-4">
          <h2 className="mb-4" style={{
            fontSize: '20px',
            color: '#ffffff',
          }}>Добавить новый магазин</h2>
          <label htmlFor="newStoreNumber" className="text-light">Номер магазина:</label>
          <input
            type="number"
            id="newStoreNumber"
            className="form-control text-light border-0 rounded"
            value={newStoreNumber}
            onChange={(e) => setNewStoreNumber(e.target.value)}
            style={{
              backgroundColor: '#555555',
              padding: '10px',
              color: '#ffffff',
              borderRadius: '4px',
            }}
            required
          />
        </div>
        <div className="form-group mb-4">


          <label htmlFor="newStoreName" className="text-light">Название магазина:</label>
          <input
            type="text"
            id="newStoreName"
            className="form-control text-light border-0 rounded"
            value={newStoreName}
            onChange={(e) => setNewStoreName(e.target.value)}
            style={{
              backgroundColor: '#555555',
              padding: '10px',
              color: '#ffffff',
              borderRadius: '4px',
            }}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block rounded" style={{
          backgroundColor: '#007bff',
          borderColor: '#007bff',
          padding: '10px 15px',
          fontSize: '16px',
          transition: 'background-color 0.3s ease',
        }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}>
          Добавить магазин
        </button>
      </form>

      <h2 className="mt-5" style={{ color: '#ffffff' }}>Существующие магазины</h2>

      <table className="table mt-3" style={{
        borderRadius: '8px', // Закругление углов таблицы
        overflow: 'hidden', // Сохранение закругления углов таблицы
      }}>
        <thead>
          <tr style={{ backgroundColor: '#555555' }}>
            <th style={{ color: '#ffffff', backgroundColor: '#2f2f2f', borderRight: '1px solid #ffffff' }}>Номер магазина</th>
            <th style={{ color: '#ffffff', backgroundColor: '#2f2f2f', borderRight: '1px solid #ffffff' }}>Название магазина</th>
            <th style={{ color: '#ffffff', backgroundColor: '#2f2f2f' }}>Действие</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store, index) => (
            <tr key={store.id} style={{ backgroundColor: index % 2 === 0 ? '#2f2f2f' : '#555555' }}>
              <td style={{ backgroundColor: index % 2 === 0 ? '#2f2f2f' : '#555555', color: '#ffffff', borderRight: '1px solid #ffffff' }}>
                {store.number}
              </td>
              <td style={{ backgroundColor: index % 2 === 0 ? '#2f2f2f' : '#555555', color: '#ffffff', borderRight: '1px solid #ffffff' }}>
                {store.name}
              </td>
              <td style={{ backgroundColor: index % 2 === 0 ? '#2f2f2f' : '#555555', color: '#ffffff' }}>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteStore(store.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default ManageStores;
