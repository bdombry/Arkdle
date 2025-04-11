import React from 'react';
import SearchBar from './components/SearchBar';

function Classique() {
  return (
    <div className="container py-5 text-center">
      <div className="bg-dark bg-opacity-75 p-4 rounded shadow-lg">
        <h1 className="display-4 text-light mb-3">Mode de jeu : Classique</h1>
        <p className="lead text-light">
          Bienvenue dans le mode classique d'Arkdle ! Trouvez le dinosaure du jour en comparant ses caractéristiques.
        </p>
      </div>

      {/* Barre de recherche */}
      <SearchBar />
    </div>
  );
}

export default Classique;
