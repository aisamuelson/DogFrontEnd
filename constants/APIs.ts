const address = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000';
const API = address + '/api';
const postAPI = API + '/posts';
const authAPI = API + '/auth';
const myPets = postAPI + '/mypet';
const myPosts = postAPI + '/myposts';
const profilePhoto = authAPI + '/profile_photo';

function getParams(token: string){
    return {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }
}

export default {
    address,
    myPets,
    myPosts,
    profilePhoto,
    postAPI,
    authAPI,
    getParams
}