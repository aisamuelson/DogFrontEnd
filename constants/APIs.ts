const API = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/';
const postAPI = API + 'posts/';
const myPets = postAPI + 'mypet';
const myPosts = postAPI + 'myposts';
function getParams(token: string){
    return {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }
}

export default {
    myPets,
    myPosts,
    postAPI,
    getParams
}