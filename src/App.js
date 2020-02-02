import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import Details from "./Details";

const peopleEndpoint = "https://swapi.co/api/people/";

const first = (list = []) => list[0];

const fetchJson = async url =>
  await fetch(url).then(response => response.json());

const extractName = ({ name }) => name;

const extractFilms = ({ films = [] }) => films;

const extractAttributes = (persona = {}) => ({
  characterName: extractName(persona),
  films: extractFilms(persona)
});

const peopleNames = people => people.map(extractName);

const findPersona = (people = [], search) =>
  first(
    people.filter(
      ({ name = "" }) =>
        name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) >= 0
    )
  );

export default function App() {
  const [people, setPeople] = useState([]);
  const [persona, setPersona] = useState(first(people));

  const onChange = event => {
    const characterName = event.target.value;
    const newPersona = findPersona(people, characterName);
    setPersona(newPersona);
  };

  useEffect(() => {
    async function filmTitles(films) {
      return await Promise.all(
        films.map(async filmUrl => {
          const filmObject = await fetchJson(filmUrl);
          return `Episode ${filmObject.episode_id} - ${filmObject.title}`;
        })
      );
    }
    fetchJson(peopleEndpoint)
      .then(async response => {
        const { results } = response;
        console.log("DEBUG: response", response);
        const people = await Promise.all(
          results.map(async ({ name, films }) => {
            const filmData = await filmTitles(films);
            return {
              name,
              films: filmData
            };
          })
        );
        return people;
      })
      .then(people => {
        setPeople(people);
        setPersona(first(people));
      });
  }, []);
  const characters = peopleNames(people);
  const disabled = characters.length <= 0;
  const { characterName, films } = extractAttributes(persona);
  return (
    <div>
      <Dropdown options={characters} onChange={onChange} disabled={disabled} />
      {!disabled && <Details characterName={characterName} films={films} />}
    </div>
  );
}
