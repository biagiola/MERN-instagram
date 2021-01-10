  import axios from 'axios'

  const instance = axios.create({
    //server from heroku cli
    //baseURL: 'https://instagram-preview.herokuapp.com/'
    baseURL: 'http://localhost:8080'

  })

  export default instance