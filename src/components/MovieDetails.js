import { useEffect } from "react";
import { useState } from "react";
import { Loading } from "../App";
import StarRating from "./StarRating";

export function MovieDetails({
  selectedId,
  onAddWatched,
  onCloseMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title: movie.Title,
      year: movie.year,
      poster: movie.Poster,
      imdbRating: Number(movie.imdbRating),
      runtime: Number(movie.Runtime.split(" ").at(0)),
      userRating: rating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=ade3e1b2&i=${selectedId}`
        );
        const movie = await res.json();
        if (!movie) {
          console.log("Error fetching movie with id: ", selectedId);
        } else {
          setMovie(movie);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [selectedId]);

  return (
    <div className="details">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={movie.Poster} alt="Name of the Movie" />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>{`${movie.Released} - ${movie.Runtime}`}</p>
              <p>{movie.Genre}</p>
              <p>⭐️ {movie.imdbRating} IMDb rating</p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size="24"
                    onSetRating={setRating}
                  />
                  {rating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated with movie {watchedUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <p>{movie.Plot}</p>
          </section>
        </>
      )}
    </div>
  );
}
