
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function Home() {
  const [semesters, setSemesters] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');

  useEffect(() => {
    // Fetch semesters from the backend
    axios.get('/api/semesters')
      .then(response => {
        setSemesters(response.data);
      })
      .catch(error => {
        console.error('Error fetching semesters:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch cards for the selected semester
    if (selectedSemester) {
      axios.get('/api/cards', { params: { sem: selectedSemester } })
        .then(response => {
          setCards(response.data);
        })
        .catch(error => {
          console.error('Error fetching cards:', error);
        });
    }
  }, [selectedSemester]);

  const handleLogout = () => {
    axios.get('/logout')
      .then(() => {
        window.location.href = '/';
      })
      .catch(err => {
        console.error('Error logging out:', err);
      });
  };

  return (
    <div className="App">
      <header>
        <div className="logo-text">
          <img src="/jaypee_main_logo.jpeg"  className="logo" />
          <h1>Jaypee Learning Hub</h1>
        </div>
      </header>
      <nav>
        <select
          onChange={(e) => setSelectedSemester(e.target.value)}
          value={selectedSemester}
        >
          <option value="" disabled selected>Select Semester</option>
          {semesters.map(sem => (
            <option key={sem.sem} value={sem.sem}>Semester {sem.sem}</option>
          ))}
        </select>
        <button onClick={handleLogout}>Logout</button>
      </nav>
      <main>
        {selectedSemester && (
          <div className="cards-container">
            {cards.map((card, index) => (
              <div className="card" key={index}>
                <img src={card.image} alt="Subject" />
                <h3>{card.subject}</h3>
                <p>{card.description.substring(0, 50)}...</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
