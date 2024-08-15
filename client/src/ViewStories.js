import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from './firebase';
import 'bootstrap/dist/css/bootstrap.min.css';

function ViewStories() {
  const [stories, setStories] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedStories, setSelectedStories] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [collapsedStores, setCollapsedStores] = useState({});

  useEffect(() => {
    const fetchStoresAndStories = async () => {
      const storesSnapshot = await getDocs(collection(db, "stores"));
      const storesData = storesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStores(storesData);

      const storiesSnapshot = await getDocs(collection(db, "stories"));
      const storiesData = storiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStories(storiesData);
    };

    fetchStoresAndStories();
  }, []);

  const getStoreNameByNumber = (storeNumber) => {
    const store = stores.find(store => store.number === storeNumber);
    return store ? store.name : 'Неизвестный магазин';
  };

  const toggleSelection = (id) => {
    setSelectedStories(prevSelected => 
      prevSelected.includes(id)
        ? prevSelected.filter(storyId => storyId !== id)
        : [...prevSelected, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedStories([]);
    } else {
      setSelectedStories(stories.map(story => story.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleStoreSelection = (storeName) => {
    const storeStoriesIds = groupedStories[storeName].map(story => story.id);
    const allSelected = storeStoriesIds.every(id => selectedStories.includes(id));
    if (allSelected) {
      setSelectedStories(prevSelected => prevSelected.filter(id => !storeStoriesIds.includes(id)));
    } else {
      setSelectedStories(prevSelected => [...new Set([...prevSelected, ...storeStoriesIds])]);
    }
  };

  const deleteSelectedStories = async () => {
    await Promise.all(selectedStories.map(async (id) => {
      await deleteDoc(doc(db, "stories", id));
    }));
    setStories(stories.filter(story => !selectedStories.includes(story.id)));
    setSelectedStories([]);
    setSelectAll(false);
  };

  const toggleCollapse = (storeName) => {
    setCollapsedStores(prevState => ({
      ...prevState,
      [storeName]: !prevState[storeName],
    }));
  };

  const groupedStories = stories.reduce((acc, story) => {
    const storeName = getStoreNameByNumber(story.item);
    if (!acc[storeName]) {
      acc[storeName] = [];
    }
    acc[storeName].push(story);
    return acc;
  }, {});

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
        Список историй
      </h1>

      <button className="btn btn-danger mb-3" onClick={deleteSelectedStories} disabled={selectedStories.length === 0}>
        Удалить выбранные истории
      </button>

      <table className="table mt-3" style={{
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <thead>
          <tr style={{ backgroundColor: '#555555' }}>
            <th style={{ color: '#ffffff', backgroundColor: '#2f2f2f', borderRight: '1px solid #444' }}>
              <input 
                type="checkbox" 
                checked={selectAll} 
                onChange={toggleSelectAll}
              /> Выбрать
            </th>
            <th style={{ color: '#ffffff', backgroundColor: '#2f2f2f', borderRight: '1px solid #444' }}>ID Истории</th>
            <th style={{ color: '#ffffff', backgroundColor: '#2f2f2f', borderRight: '1px solid #444' }}>Название магазина</th>
            <th style={{ color: '#ffffff', backgroundColor: '#2f2f2f' }}>URL</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedStories).map((storeName, storeIndex) => (
            <React.Fragment key={storeName}>
              <tr style={{ backgroundColor: storeIndex % 2 === 0 ? '#444444' : '#666666' }}>
                <td style={{ color: '#ffffff', backgroundColor: '#040404', borderRight: '1px solid #444' }}>
                  <input 
                    type="checkbox" 
                    checked={groupedStories[storeName].every(story => selectedStories.includes(story.id))}
                    onChange={() => toggleStoreSelection(storeName)}
                  />
                </td>
                <td colSpan="3" style={{ color: '#ffffff', backgroundColor: '#040404', borderRight: '1px solid #444', cursor: 'pointer' }} onClick={() => toggleCollapse(storeName)}>
                  {collapsedStores[storeName] ? '▲' : '▼'} {storeName}
                </td>
              </tr>
              {!collapsedStores[storeName] && groupedStories[storeName].map((story, storyIndex) => (
                <tr key={story.id} style={{ backgroundColor: (storeIndex + storyIndex) % 2 === 0 ? '#2f2f2f' : '#555555' }}>
                  <td style={{ backgroundColor: (storeIndex + storyIndex) % 2 === 0 ? '#2f2f2f' : '#555555', color: '#ffffff', borderRight: '1px solid #444' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedStories.includes(story.id)}
                      onChange={() => toggleSelection(story.id)}
                    />
                  </td>
                  <td style={{ backgroundColor: (storeIndex + storyIndex) % 2 === 0 ? '#2f2f2f' : '#555555', color: '#ffffff', borderRight: '1px solid #444' }}>
                    {story.id}
                  </td>
                  <td style={{ backgroundColor: (storeIndex + storyIndex) % 2 === 0 ? '#2f2f2f' : '#555555', color: '#ffffff', borderRight: '1px solid #444' }}>
                    {getStoreNameByNumber(story.item)}
                  </td>
                  <td style={{ backgroundColor: (storeIndex + storyIndex) % 2 === 0 ? '#2f2f2f' : '#555555', color: '#ffffff' }}>
                    {story.url}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewStories;
