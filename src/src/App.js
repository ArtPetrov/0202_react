import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async() => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api');
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const responseData = await response.text();
        setData(responseData);
      } catch (e) {
        setError(e.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const body = () => {
    if (loading) {
      return <>Загружаем данные...</>;
    }
    if (error) {
      return <>Ошибка: {error}</>;
    }

    return <>Получены данные: {data}</>;
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{body()}</p>
      </header>
    </div>
  );
}

export default App;
