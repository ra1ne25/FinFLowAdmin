import React, { useState, useEffect } from 'react';
import { getDocs, collection } from "firebase/firestore";
import { db } from './firebase';

function ExpirationDates() {
    const [stores, setStores] = useState([]);
    const [expirationDates, setExpirationDates] = useState({});

    const telegramBotToken = '7242473291:AAEhf58XdbLNCRsNjmpBLuQNWOvw9vP7eM4';
    const chatIds = ['428881069']; // Замените на список ваших chat ID

    useEffect(() => {
        const fetchStores = async () => {
            const querySnapshot = await getDocs(collection(db, "stores"));
            const storesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            storesData.sort((a, b) => a.number - b.number); // Сортировка по номеру магазина
            setStores(storesData);

            // Загрузка сохраненных сроков действия из локального хранилища
            const savedDates = JSON.parse(localStorage.getItem('expirationDates')) || {};
            setExpirationDates(savedDates);
        };

        fetchStores();

        // Настройка автоматической отправки уведомлений в 10:50 каждый день
        const intervalId = setInterval(() => {
            const now = new Date();
            if (now.getHours() === 10 && now.getMinutes() === 54) {
                stores.forEach(store => {
                    const expirationDate = expirationDates[store.number];
                    const daysLeft = expirationDate ? calculateDaysLeft(expirationDate) : null;
                    if (daysLeft === 1) {
                        sendTelegramNotification(store.name);
                    }
                });
            }
        }, 60000); // Проверка каждую минуту

        return () => clearInterval(intervalId); // Очистка интервала при размонтировании компонента

    }, [stores, expirationDates]); // Добавлены зависимости для корректного отслеживания изменений

    const calculateDaysLeft = (expirationDate) => {
        const today = new Date();
        const expDate = new Date(expirationDate);
        const timeDiff = expDate - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysLeft;
    };

    const sendTelegramNotification = (storeName) => {
        const message = `Остался 1 день до конца действия акции в магазине "${storeName}".`;
        chatIds.forEach(chatId => {
            fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (!data.ok) {
                        console.error('Ошибка при отправке уведомления:', data);
                    } else {
                        console.log('Уведомление отправлено успешно');
                    }
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                });
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
                Сроки действия
            </h1>

            <table className="table mt-3" style={{
                borderRadius: '8px',
                overflow: 'hidden',
            }}>
                <thead>
                    <tr style={{ backgroundColor: '#555555' }}>
                        <th style={{ color: '#ffffff', backgroundColor: '#2f2f2f', borderRight: '1px solid #ffffff' }}>Название магазина</th>
                        <th style={{ color: '#ffffff', backgroundColor: '#2f2f2f', borderRight: '1px solid #ffffff' }}>Дней до конца</th>
                        <th style={{ color: '#ffffff', backgroundColor: '#2f2f2f', borderRight: '1px solid #ffffff' }}>Срок действия</th>
                        <th style={{ color: '#ffffff', backgroundColor: '#2f2f2f' }}>Уведомление</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map((store, index) => {
                        const expirationDate = expirationDates[store.number];
                        const daysLeft = expirationDate ? calculateDaysLeft(expirationDate) : 'Дата не указана';

                        return (
                            <tr key={store.id} style={{ backgroundColor: index % 2 === 0 ? '#2f2f2f' : '#555555' }}>
                                <td style={{
                                    backgroundColor: (daysLeft <= 3 && daysLeft > 0) ? '#FF6347' : (index % 2 === 0 ? '#2f2f2f' : '#555555'),
                                    color: '#ffffff',
                                    borderRight: '1px solid #ffffff'
                                }}>
                                    {store.name}
                                </td>
                                <td style={{
                                    backgroundColor: (daysLeft <= 3 && daysLeft > 0) ? '#FF6347' : (index % 2 === 0 ? '#2f2f2f' : '#555555'),
                                    color: '#ffffff',
                                    borderRight: '1px solid #ffffff'
                                }}>{daysLeft}</td>
                                <td style={{
                                    backgroundColor: (daysLeft <= 3 && daysLeft > 0) ? '#FF6347' : (index % 2 === 0 ? '#2f2f2f' : '#555555'),
                                    color: '#ffffff',
                                    borderRight: '1px solid #ffffff'
                                }}>
                                    {expirationDate ? new Date(expirationDate).toLocaleDateString('ru-RU') : 'Дата не указана'}
                                </td>
                                <td style={{
                                    backgroundColor: (daysLeft <= 3 && daysLeft > 0) ? '#FF6347' : (index % 2 === 0 ? '#2f2f2f' : '#555555'),
                                    color: '#ffffff',
                                    borderRight: '1px solid #ffffff'
                                }}>
                                    {daysLeft === 1 && (
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => sendTelegramNotification(store.name)}>
                                            Отправить уведомление
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default ExpirationDates;
