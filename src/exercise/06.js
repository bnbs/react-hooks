// useEffect: HTTP requests
// 💯 use resetKeys
// http://localhost:3000/isolated/final/06.extra-8.js

import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
} from '../pokemon'

const PokemonInfo = ({ pokemonName }) => {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  });

  const { status, pokemon, error } = state;

  React.useEffect(() => {
    if (!pokemonName) return;

    setState({ status: 'pending' });

    fetchPokemon(pokemonName) 
      .then(pokemon => setState({ status: 'resolved', pokemon }))
      .catch(error => setState({ status: 'rejected', error }))
  }, [pokemonName])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
}

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

const App = () => {
  const [pokemonName, setPokemonName] = React.useState('')

  const handleSubmit = (newPokemonName) => setPokemonName(newPokemonName)

  const handleReset = () => setPokemonName('')

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
