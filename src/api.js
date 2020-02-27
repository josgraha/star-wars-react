import { v3 } from "@leonardocabeza/the-movie-db";
import Actions from "./actions";

const swapiBaseUrl = "https://swapi.co/api/";
const peopleEndpoint = `${swapiBaseUrl}people/`;

const first = (list = []) => list[0];

const flatten = (listOfLists = []) =>
  listOfLists.reduce((results, list) => results.concat(list), []);

const fetchJson = async url => {
  return await fetch(url).then(response => response.json());
};
const fetchAllSwapi = async (url, lastResults = []) => {
  const { count, next, results = [] } = await fetchJson(url);
  const nextResults = lastResults.concat(results);
  if (nextResults.length === count || !next) {
    return nextResults;
  }
  return await fetchAllSwapi(next, nextResults);
};

const mergeCastAndCharacters = ({ characters = [], films = [] }) => {
  const filmCastList = films.map(({ cast }) => cast);
  const flattenedCastList = flatten(filmCastList);
  const castMap = flattenedCastList.reduce((nameMap, castMember) => {
    const { character = "", name, ...rest } = castMember;
    const key = character.toLocaleLowerCase();
    if (nameMap[key]) {
      return nameMap;
    }
    nameMap[key] = { ...rest, name: character, actor: name };
    return nameMap;
  }, {});
  return characters.map(character => {
    const { name = "" } = character;
    const key = name.toLocaleLowerCase();
    const castDetails = castMap[key] || {};
    return { ...character, ...castDetails };
  });
};

export const findPersona = (people = [], search) =>
  first(
    people.filter(
      ({ name = "" }) =>
        name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) >= 0
    )
  );

const createImageSource = (url, baseUrl) => `${baseUrl}w185/${url}`;

const extractMovieDetails = (results = [], apiConfiguration) => {
  const movie = first(results);
  const posterUrl = createImageSource(
    movie.poster_path,
    apiConfiguration.images.base_url
  );
  const { id, overview, title, vote_average } = movie;
  return {
    id,
    overview,
    posterUrl,
    title,
    voteAverage: vote_average
  };
};

const characterFilms = (swapiCharacters = []) =>
  swapiCharacters.reduce((allFilms, character) => {
    const { films = [] } = character;
    const filmsToAdd = films.filter(film => allFilms.indexOf(film) === -1);
    return allFilms.concat(filmsToAdd);
  }, []);

export const loadApi = async tmdbApiKey => {
  const v3Client = v3(tmdbApiKey);
  const fetchApiConfig = async () => await v3Client.configuration.api();
  const apiConfiguration = await fetchApiConfig();

  const fetchTmdbFilmDetails = async ({ apiConfiguration, query, year }) => {
    const { results } = await v3Client.search.movies({ query, year });
    return extractMovieDetails(results, apiConfiguration);
  };

  const fetchTmdbFilmCast = async id => {
    const credits = await v3Client.movie.credits(id);
    const { cast } = credits;
    return cast.map(
      ({ cast_id, character, credit_id, gender, id, name, profile_path }) => ({
        castId: cast_id,
        character,
        creditId: credit_id,
        gender,
        id,
        name,
        profileUrl: createImageSource(
          profile_path,
          apiConfiguration.images.base_url
        )
      })
    );
  };

  const fetchCombinedFilmData = async swapiFilmUrl => {
    const swapiFilmDetails = await fetchJson(swapiFilmUrl);
    const { release_date: releaseDate, title } = swapiFilmDetails;
    const year = first(releaseDate.split("-"));
    const tmdbDetails = await fetchTmdbFilmDetails({
      apiConfiguration,
      query: title,
      year
    });
    const { id } = tmdbDetails;
    const cast = await fetchTmdbFilmCast(id);
    return { ...tmdbDetails, ...swapiFilmDetails, cast, year };
  };
  const swapiCharacters = await fetchAllSwapi(peopleEndpoint);
  const swapiFilms = characterFilms(swapiCharacters);

  const combinedFilms = await Promise.all(
    swapiFilms.map(fetchCombinedFilmData)
  );

  const characters = mergeCastAndCharacters({
    characters: swapiCharacters,
    films: combinedFilms
  });

  return Promise.resolve({
    type: Actions.SET_MOVIE_DATA,
    payload: { characters, films: combinedFilms }
  });
};
