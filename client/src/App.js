import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar'; // Ваш Sidebar компонент
import AddStory from './AddStory'; // Импортируйте ваш компонент AddStory
import ManageStores from './ManageStores'; // Импортируйте ваш компонент ManageStores
import ViewStories from './ViewStories'; // Импортируем новый компонент
import ExpirationDates from './ExpirationDates'; // Импортируем новый компонент


function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar /> {/* Ваш Sidebar компонент */}
        <main style={{ flexGrow: 1, padding: '20px', backgroundColor: '#212121', color: '#ffffff' }}>
          <Routes>
            <Route path="/" element={<AddStory />} /> {/* Главная страница */}
            <Route path="/add-story" element={<AddStory />} /> {/* Страница добавления истории */}
            <Route path="/manage-stores" element={<ManageStores />} /> {/* Страница управления магазинами */}
            <Route path="/view-stories" element={<ViewStories />} /> {/* Добавляем новый маршрут */}
            <Route path="/expiration-dates" element={<ExpirationDates />} /> {/* Добавляем новый маршрут */}

          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default App;
