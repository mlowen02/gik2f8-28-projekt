const express = require('express');
const app = express();
const fs = require('fs/promises');
const PORT = 5000;

app.use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');

    next();
});

app.get('/movies', async (req, res) => {
  try {
    res.send(JSON.parse(await fs.readFile('./movies.json')));
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.post('/movies', async (req, res) => {
  try {
    const movie = req.body;
    const currentMovies = JSON.parse(await fs.readFile('./movies.json'));
    let maxMovieId = 1;
    if (currentMovies && currentMovies.length > 0) {
      maxMovieId = currentMovies.reduce(
        (maxId, currentElement) => (currentElement.id > maxId ? currentElement.id : maxId),
        maxMovieId);
        
    }
    const newMovie = { id: maxMovieId + 1, ...movie };
    const newList = currentMovies ? [...currentMovies, newMovie] : [newMovie];
    await fs.writeFile('./movies.json', JSON.stringify(newList));
    res.send(newMovie);
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

app.delete('/movies/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const currentMovies = JSON.parse(await fs.readFile('./movies.json'));
    if (currentMovies.length > 0) {
      await fs.writeFile('./movies.json', JSON.stringify(currentMovies.filter((movie) => movie.id != id)));
      res.send({ message: `Uppgift med id ${id} togs bort` });
    } else {
      res.status(404).send({ error: 'Ingen uppgift att ta bort' });
    }
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

app.patch('/movies/:id', async (req,res) =>{
  try {
    const newData = req.body;
    const id = req.params.id;
    const currentMovies = JSON.parse(await fs.readFile('./movies.json'));
    if (currentMovies.length > 0){
      let foundMovie =  currentMovies.filter(movie => movie.id == id);
      if(foundMovie.length == 1){
        Object.assign(foundMovie[0], newData);
        const newMovieList = currentMovies.filter(movie => movie.id != id);
        await fs.writeFile('./movies.json', JSON.stringify([...newMovieList, foundMovie[0]]));
        res.send(foundMovie);
      }else{
        res.status(500).send({message: "unable to find task with id: " + id})
      } 
    } 
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});
app.listen(PORT, () => console.log('Server listening on port: '+ PORT));

