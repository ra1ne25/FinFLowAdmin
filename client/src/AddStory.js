import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from './firebase';

function AddStory() {
  const [item, setItem] = useState('');
  const [urls, setUrls] = useState('');
  const [stores, setStores] = useState([]);
  const [expirationDates, setExpirationDates] = useState({}); // Хранение сроков действия

  useEffect(() => {
    const fetchStores = async () => {
      const querySnapshot = await getDocs(collection(db, "stores"));
      const storesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      storesData.sort((a, b) => a.number - b.number); // Сортировка по номеру магазина
      setStores(storesData);
    };
    fetchStores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlArray = urls.split('\n').map(url => url.trim()).filter(Boolean);

    try {
      const storiesCollection = collection(db, "stories");

      for (const url of urlArray) {
        await addDoc(storiesCollection, {
          item: Number(item),
          url: url
        });
      }

      alert('Истории успешно добавлены');
      setItem('');
      setUrls('');
    } catch (error) {
      console.error('Ошибка при добавлении историй:', error);
      alert('Ошибка при добавлении историй');
    }
  };

  const handleDateChange = (storeNumber, date) => {
    setExpirationDates(prevDates => {
      const updatedDates = {
        ...prevDates,
        [storeNumber]: date,
      };
      localStorage.setItem('expirationDates', JSON.stringify(updatedDates));
      return updatedDates;
    });
  };


  return (
    <div>
      <h1 className="mb-4 text-light" style={{
        textAlign: 'left',
        fontSize: '24px',
        fontWeight: 'bold',
        paddingLeft: '10px',
        borderLeft: '4px solid #007bff',
        paddingBottom: '10px',
        marginBottom: '20px',
        color: '#ffffff',
      }}>
        Добавить истории
      </h1>
      <form onSubmit={handleSubmit} className="p-4 rounded shadow-sm" style={{ backgroundColor: '#2f2f2f', border: '1px solid #444', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
        <div className="form-group mb-4">
          <h2 className="mb-4" style={{
            fontSize: '20px',
            color: '#ffffff',
          }}>Добавить новые истории</h2>

          <label htmlFor="storeSelect" className="text-light">Выберите магазин:</label>
          <select
            id="storeSelect"
            className="form-control text-light border-0 rounded"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            style={{
              backgroundColor: '#555555',
              padding: '10px',
              color: '#ffffff',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
            required
          >
            <option value="">Выберите магазин...</option>
            {stores.map(store => (
              <option key={store.id} value={store.number}>{store.name}</option>
            ))}
          </select>

        </div>
        <div className="form-group mb-4">
          <label htmlFor="urls" className="text-light">URL-адреса (по одному на строку):</label>
          <textarea
            id="urls"
            className="form-control text-light border-0 rounded"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            rows="10"
            style={{ backgroundColor: '#555555' }}
            required
          />
        </div>
        {item && (
          <div className="form-group mb-4">
            <label htmlFor="expirationDate" className="text-light">Срок действия:</label>
            <input
              type="date"
              id="expirationDate"
              className="form-control text-light border-0 rounded"
              value={expirationDates[item] || ''}
              onChange={(e) => handleDateChange(item, e.target.value)}
              style={{ backgroundColor: '#555555' }}
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary btn-block rounded" style={{
          backgroundColor: '#007bff',
          borderColor: '#007bff',
          padding: '10px 15px',
          fontSize: '16px',
          transition: 'background-color 0.3s ease',
        }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}>
          Добавить истории
        </button>
      </form>
    </div>
  );
}

export default AddStory;
