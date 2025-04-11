import React, { useState, useEffect } from 'react';
import '../SearchBar.css';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDinos, setFilteredDinos] = useState([]);
  const [allDinos, setAllDinos] = useState([]);
  const [creatureAleatoire, setCreatureAleatoire] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [isFound, setIsFound] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Clé basée sur la date pour le stockage local
  const todayKey = new Date().toISOString().split('T')[0];
  const STORAGE_KEY = `arkdle-${todayKey}`;

  useEffect(() => {
    const fetchData = async () => {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const [dinoRes, creatureRes] = await Promise.all([
        fetch('http://localhost:3001/api/dinosaures').then((res) => res.json()),
        fetch('http://localhost:3001/api/creature-du-jour').then((res) => res.json()),
      ]);

      setAllDinos(dinoRes);
      setFilteredDinos(dinoRes);
      setCreatureAleatoire(creatureRes);

      if (saved) {
        setGuesses(saved.guesses || []);
        setIsFound(saved.isFound || false);
      }
      setIsReady(true);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isReady) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ guesses, isFound }));
    }
  }, [guesses, isFound, isReady]);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const alreadyTriedIds = guesses.map((g) => g.id);
    const filtered = allDinos.filter(
      (dino) =>
        dino.nom.toLowerCase().includes(value) &&
        !alreadyTriedIds.includes(dino.id)
    );

    setFilteredDinos(filtered);
  };

  const handleDinoSelect = (dino) => {
    setSearchTerm('');
    setFilteredDinos([]);
    setIsFound(dino.nom === creatureAleatoire.nom);
    setGuesses((prev) => [...prev, dino]);
  };

  // Fonction de comparaison pour appliquer une classe CSS
  const compare = (a, b) => (a === b ? 'correct' : 'incorrect');

  const characteristics = [
    'carte_origine',
    'taille',
    'type_peau',
    'annee_sortie',
    'deplacement',
    'apprivoisable',
    'montable',
    'habitat',
  ];

  // Largeur totale calculée en pixels (60px pour la 1ère colonne, 8 colonnes de 110px et 8 gaps de 15px)
  const fixedWidth = '1060px';

  // Style commun pour l'en‑tête et chaque ligne, avec un gap fixe de 15px
  const rowCommonStyle = {
    width: fixedWidth,
    border: '1px solid white',
    boxShadow: '0 0 5px rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    padding: '10px',
    gap: '15px'
  };

  if (!isReady || !creatureAleatoire) return null;

  return (
    <div className="container mt-4 text-center">
      {/* Zone de recherche */}
      {!isFound && (
        <>
          <h1 className="text-white fw-bold display-5">
            Devinez le dinosaure du jour !
          </h1>
          <div className="col-md-6 mx-auto">
            <input
              type="text"
              className="form-control my-3"
              placeholder="Entrez le nom d'un dinosaure..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {searchTerm && filteredDinos.length > 0 && (
            <div
              className="card col-md-6 mx-auto"
              style={{ maxHeight: '300px', overflowY: 'auto' }}
            >
              <ul className="list-group list-group-flush">
                {filteredDinos.map((dino) => (
                  <li
                    key={dino.id}
                    className="list-group-item list-group-item-action d-flex align-items-center"
                    onClick={() => handleDinoSelect(dino)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={dino.img_url}
                      alt={dino.nom}
                      className="me-2"
                      style={{ width: 40, height: 40 }}
                    />
                    {dino.nom}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {guesses.length > 0 && (
        <div className="mt-5 d-flex justify-content-center">
          <div className="overflow-auto" style={{ maxWidth: '1200px' }}>
            <div style={{ width: fixedWidth, margin: '0 auto' }}>
              {/* En‑tête */}
              <div
                style={rowCommonStyle}
                className="d-flex align-items-center text-white fw-bold bg-dark mb-3"
              >
                {/* Première cellule avec espace supplémentaire (marginRight) */}
                <div style={{ width: '60px', marginRight: '15px' }}>Dinosaure</div>
                {characteristics.map((key) => (
                  <div key={key} style={{ width: '110px' }}>
                    {key.replace('_', ' ')}
                  </div>
                ))}
              </div>

              {/* Inversion de l'ordre : le guess le plus récent en haut */}
              {[...guesses].reverse().map((guess, index) => (
                <div
                  key={index}
                  style={rowCommonStyle}
                  className="d-flex align-items-center text-white bg-dark mb-3"
                >
                  <div style={{ width: '60px', marginRight: '15px' }}>
                    <img
                      src={guess.img_url}
                      alt={guess.nom}
                      title={guess.nom}
                      className="rounded"
                      style={{ width: 50, height: 50 }}
                    />
                  </div>
                  {characteristics.map((carac) => (
                    <div
                      key={carac}
                      style={{ width: '110px' }}
                      className={`text-center rounded px-2 py-1 ${compare(
                        guess[carac],
                        creatureAleatoire[carac]
                      )}`}
                    >
                      {guess[carac] || 'N/A'}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Légende */}
      <div className="card bg-dark text-white mt-5 p-3 col-md-6 mx-auto">
        <h5 className="text-center">Légende des couleurs</h5>
        <div className="d-flex justify-content-around mt-2">
          <div>
            <span className="legend-box correct me-2"></span>Correct
          </div>
          <div>
            <span className="legend-box incorrect me-2"></span>Incorrect
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
