import React, { useEffect, useState } from 'react';

function DinosauresList() {
  const [dinosaures, setDinosaures] = useState([]); // Liste des dinosaures
  const [isLoading, setIsLoading] = useState(true); // Chargement en cours
  const [error, setError] = useState(null); // Gestion des erreurs

  // Récupération des dinosaures depuis l'API au chargement du composant
  useEffect(() => {
    fetch('http://localhost:3001/api/dinosaures') // Endpoint de l'API backend
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        return response.json();
      })
      .then((data) => {
        setDinosaures(data); // Stocke les dinosaures dans l'état
        setIsLoading(false); // Arrête le chargement
      })
      .catch((error) => {
        setError(error.message); // Capture les erreurs
        setIsLoading(false);
      });
  }, []);

  // Affichage d'un message de chargement
  if (isLoading) {
    return <h1>Chargement en cours...</h1>;
  }

  // Affichage d'un message d'erreur si une erreur survient
  if (error) {
    return <h1 style={{ color: 'red' }}>Erreur : {error}</h1>;
  }

  return (
    <div style={containerStyle}>
      <h1>Liste des Dinosaures</h1>
      <ul style={listStyle}>
        {dinosaures.map((dino) => (
          <li key={dino.id} style={listItemStyle}>
            <h2>{dino.nom}</h2>
            {/* Si une image est disponible */}
            {dino.img_url && (
              <img
                src={dino.img_url}
                alt={dino.nom}
                style={imageStyle}
              />
            )}
            <p>Carte d'origine : {dino.carte_origine}</p>
            <p>Habitat : {dino.type_habitat}</p>
            <p>Type de peau : {dino.type_peau}</p>
            <p>Taille : {dino.taille}</p>
            <p>Dégâts de mêlée : {dino.degats_melee}</p>
            <p>Déplacement : {dino.deplacement}</p>
            <p>Apprivoisable : {dino.apprivoisable ? 'Oui' : 'Non'}</p>
            <p>Montable : {dino.montable ? 'Oui' : 'Non'}</p>
            <p>Année de sortie : {dino.annee_sortie}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Styles en ligne
const containerStyle = {
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
};

const listStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
  color: '#000',
};

const listItemStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '15px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  backgroundColor: '#fff',
};

const imageStyle = {
  width: '150px',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '8px',
  margin: '10px 0',
};

export default DinosauresList;
