let moviesList = "";
const api = new Api('http://localhost:5000/movies');

moviesForm.addEventListener('submit', e => {
    e.preventDefault();
    if(!validFields()){
        return
    }
    sendData();
});

function validFields(){
    let valid = true;
    let message = "All fields valid!";
    if(title.value.length <= 3){
        valid = false;
        message = "Title too short";
    }else if(producer.value.length <=0){
        valid = false;
        message = "Movie needs a producer";
    }else if(releaseDate.value == 0){
        valid = false;
        message = "Movie needs a release date";
    }
    console.log(message)
    return valid
}

function sendData(){
    const movie = {
        title: moviesForm.title.value,
        producer: moviesForm.producer.value,
        releaseDate: moviesForm.releaseDate.value
    };

    api.create(movie).then(movie => {if(movie){
        printMovies();
    }});
}

async function printMovies(list){
    moviesUL.innerHTML = '';
    console.log("printing movies!");
    const movies = await api.getAll();
    movies.forEach(movie => { 
        moviesUL.insertAdjacentHTML('beforeend', createHTML(movie))
    }); 
}

function createHTML({title, producer, releaseDate, id}){
    let html = `
    <li class="border-b flex-row flex p-2 hover:shadow-2xl hover:border-b-4 bg-gradient-to-r from-purple-500 to-pink-500">
        <section>
            <h1 class="text-2xl font-serif">${title}</h1>
            <small>${releaseDate}</small>
        </section>
        <section class="flex flex-row-reverse flex-1">
            <button class="border p-2 m-2 rounded-md hover:bg-cyan-600 bg-cyan-500" onclick="remove(${id})">
                Remove
            </button>
            <button class="border p-2 m-2 rounded-md hover:bg-cyan-600 bg-cyan-500" onclick="update(${id})">
                Update
            </button>
        </section>
    </li>`;
    return html;
}

function update(id){
    let movie = {};
    if(title.value.length <= 3 && producer.value.length <= 0 && releaseDate.value == 0) return
    if(title.value.length > 3){
        movie = {title: title.value};
    }
    if(producer.value.length > 0){
        movie = {...movie, producer: producer.value};
    }
    if(releaseDate.value != 0){
        movie = {...movie, releaseDate: releaseDate.value};
    }
    api.update(id, movie).then(data => {
        printMovies();
    })
    .catch(error => console.log(error));
}

function remove(id){
    console.log(id);
    api.remove(id)
    .then(movie => {
        printMovies();
    })
    .catch(error => console.log(error));
}

function clearFields(e){
    e.preventDefault();
    title.value = "";
    producer.value = "";
    releaseDate.value = "";
}
printMovies();