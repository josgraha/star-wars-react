import React, { useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import Actions from "./actions";
import GridList from "./grid-list/";
import Details from "./Details";

import { findPersona, loadApi } from "./api";

const ApiStatus = {
  loading: "Loading",
  loaded: "Loaded"
};

const initialState = {
  movieData: {
    characters: [],
    films: []
  },
  selectedCharacter: null,
  status: ApiStatus.loading
};

const reducer = (state, action) => {
  switch (action.type) {
    case Actions.SET_MOVIE_DATA:
      return { ...state, movieData: action.payload, status: ApiStatus.loaded };
    default:
      return state;
  }
};

export default function App({ tmdbApiKey }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { movieData, selectedCharacter, status } = state;
  const { characters = [] } = movieData;
  const options = characters.map(({ name, actor, profileUrl }) => ({
    key: name,
    title: name,
    subtitle: actor,
    imageUrl: profileUrl
  }));
  const onChange = event => {
    const characterName = event.value;
    const newPersona = findPersona(characters, characterName);
    dispatch({ type: Actions.VIEW_CHARACTER, payload: newPersona });
  };

  useEffect(() => {
    if (status !== ApiStatus.loaded) {
      loadApi(tmdbApiKey).then(action => dispatch(action));
    }
  }, [tmdbApiKey, status]);

  return (
    <div>
      <GridList options={options} onChange={onChange} />
      {selectedCharacter && (
        <Details characterName={selectedCharacter} films={[]} />
      )}
    </div>
  );
}

App.propTypes = {
  tmdbApiKey: PropTypes.string
};
