import React, { useEffect, useReducer, useMemo } from "react";
import PropTypes from "prop-types";
import Actions from "./actions";
import Navbar from "./navbar";

import { findPersona, loadApi } from "./api";

import "./App.css";
import CardList from "./card-list";

const ApiStatus = {
  loading: "Loading",
  loaded: "Loaded"
};

const initialState = {
  movieData: {
    characters: [],
    films: []
  },
  searchText: null,
  selectedCharacter: null,
  status: ApiStatus.loading
};

const reducer = (state, action) => {
  switch (action.type) {
    case Actions.SET_MOVIE_DATA:
      return { ...state, movieData: action.payload, status: ApiStatus.loaded };
    case Actions.TOGGLE_VIEW_CHARACTER:
      return { ...state, selectedCharacter: action.payload };
    case Actions.SEARCH:
      return { ...state, searchText: action.payload };
    default:
      return state;
  }
};

const createContains = (searchText = "") => (target = "") =>
  target.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1;

const characterToCardDetails = ({
  name,
  actor,
  profileUrl,
  hair_color,
  gender,
  skin_color,
  eye_color,
  mass,
  height,
  birth_year
}) => {
  const headDescription =
    hair_color === "n/a" || hair_color === "none"
      ? "smooth head"
      : `${hair_color} hair`;
  return {
    content: `My face crowned by my ${headDescription} sets off my ${skin_color} complexion gazing at you with my dreamy ${eye_color} eyes.  I entered the galaxy on ${birth_year} and weigh ${mass} m-units and stand ${height} l-units tall.`,
    imageUrl: profileUrl,
    key: name,
    title: name,
    showDetails: true,
    subtitle: actor
  };
};

const filmToCardDetails = ({ id, overview, posterUrl, title }) => {
  return {
    imageUrl: posterUrl,
    key: id,
    title,
    content: overview
  };
};

export default function App({ tmdbApiKey }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { movieData, searchText, selectedCharacter, status } = state;
  const { characters = [] } = movieData;
  const filteredCharacters = useMemo( () => {
    const containsSearchText = createContains(searchText);
    return !searchText ? characters : characters.filter(({ name = '', actor = '' }) => containsSearchText(name) || containsSearchText(actor));
}, [characters, searchText]);
  const cardItems = filteredCharacters.map(characterToCardDetails);

  const findFilmsForPersona = persona =>
    persona && persona.films && persona.films.length > 0
      ? persona.films.reduce(
          (movies, url) =>
            movies.concat(
              movieData.films.filter(({ url: movieUrl }) => url === movieUrl)
            ),
          []
        )
      : [];

  const personaCardDetails = persona =>
    findFilmsForPersona(persona).map(filmToCardDetails);

  const Details = ({ persona }) =>
    !persona ? null : (
      <CardList
        className="detail-list-dark"
        cards={personaCardDetails(persona)}
        columnCount={4}
      />
    );


  const onSearch = ({ value }) => {
    dispatch({ type: Actions.SEARCH, payload: value });
  };

  const onChange = event => {
    const characterName = event.value;
    dispatch({
      type: Actions.TOGGLE_VIEW_CHARACTER,
      payload: characterName
    });
  };

  useEffect(() => {
    if (status !== ApiStatus.loaded) {
      loadApi(tmdbApiKey).then(action => dispatch(action));
    }
  }, [tmdbApiKey, status]);

  const character = selectedCharacter
    ? findPersona(characters, selectedCharacter)
    : null;
  return (
    <div className="app">
      <Navbar onSearch={onSearch} />
      <CardList
        cards={cardItems}
        columnCount={4}
        detailsLabel={"My Stories"}
        details={<Details persona={character} />}
        selected={selectedCharacter}
        onChange={onChange}
      />
    </div>
  );
}

App.propTypes = {
  tmdbApiKey: PropTypes.string
};
