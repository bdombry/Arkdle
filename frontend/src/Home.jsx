import React from 'react';
import { Link } from 'react-router-dom'; // Permet la navigation entre les pages

function Home() {
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>ARKDLE</h1>
      <p style={descriptionStyle}>
        Bienvenue dans ARKDLE ! Découvrez les dinosaures d'ARK et testez vos connaissances en devinant leurs caractéristiques.
      </p>

      {/* Boutons de navigation */}
      <div style={buttonContainerStyle}>
        <Link to="/classique" style={linkStyle}>
          <button style={buttonStyle}>Mode Classique</button>
        </Link>
        <Link to="/dinosaureslist" style={linkStyle}>
          <button style={buttonStyle}>Liste des Dinosaures</button>
        </Link>
      </div>
    </div>
  );
}

// Styles en ligne
const containerStyle = {
  textAlign: 'center',
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
};

const titleStyle = {
  fontSize: '36px',
  color: '#fff',
  marginBottom: '10px',
};

const descriptionStyle = {
  fontSize: '18px',
  color: '#fff',
  marginBottom: '20px',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  flexWrap: 'wrap',
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '18px',
  borderRadius: '8px',
  border: '2px solid #ccc',
  backgroundColor: '#fff',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const linkStyle = {
  textDecoration: 'none',
};

export default Home;
