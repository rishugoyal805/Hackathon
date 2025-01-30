import  { useEffect, useState } from 'react';
import axios from 'axios';

const Announce = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [news, setNews] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/announcements').then(res => setAnnouncements(res.data));
        axios.get('http://localhost:5000/news').then(res => setNews(res.data));
    }, []);

    return (
        <div className="an_container">
            <div className="announcements">
                {announcements.length > 0 ? announcements.map((ann, index) => (
                    <div key={index} className="announcement">
                        <div className="text-content">
                            <h2>{ann.title}</h2>
                            <p>{ann.content}</p>
                            <p><a className="ann_link" href={ann.link}>Link</a></p>
                        </div>
                        {ann.image && <img src={ann.image} alt={`Image for ${ann.title}`} />}
                    </div>
                )) : <p>No active announcements available.</p>}
            </div>
            <div id="news-section">
                <h3>News and Updates</h3>
                {news.length > 0 ? news.map((n, index) => (
                    <div key={index} className="news-item">
                        <p><a href={n.link} target="_blank" rel="noopener noreferrer">{n.data}</a></p>
                        <hr />
                    </div>
                )) : <p>No active news available.</p>}
            </div>
        </div>
    );
};

export default Announce;
