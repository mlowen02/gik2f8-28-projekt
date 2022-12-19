class Api{
    url = "";

    constructor (url){
        this.url = url;
    }
    
    async create(data){
        const JSONData = JSON.stringify(data);
        console.log(`sending ${JSONData}`);

        return fetch(this.url,{
            method: 'POST',
            body: JSONData,
            headers:{
                'content-type': 'application/json'
            }
        })
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
    }

    async getAll(){
        return fetch(this.url)
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
    }

    remove(id) {
        console.log(`Removing task with id ${id}`);
        return fetch(`${this.url}/${id}`, {
          method: 'DELETE'
        })
          .then((result) => result)
          .catch((err) => console.log(err));
    }
    
    update(id, data){
        //formatera data
        const JSONData = JSON.stringify(data);
        //gör anrop
        return fetch(`${this.url}/${id}`, {
          method: 'PATCH',
          body: JSONData,
          headers: {
            'content-type': 'application/json'
          }
        });
    }

    update(id, data){
        const JSONData = JSON.stringify(data);

        return fetch(`${this.url}/${id}`, {
          method: 'PATCH',
          body: JSONData,
          headers: {
            'content-type': 'application/json'
          }
        });
    }
}