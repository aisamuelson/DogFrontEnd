const API = 'http://ec2-18-220-242-107.us-east-2.compute.amazonaws.com:8000/api/';
const postAPI = API + 'posts/';
const myPets = postAPI + 'mypet';
const myPosts = postAPI + 'myposts'

export default {
    myPets,
    myPosts,
    tempAuth: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InhyaWN4eTEzMTRAZ21haWwuY29tIiwiZXhwIjoxNjQ5MTIzNjg4fQ.aVqzYNBNTBCQYwdcakDWdZ2ZZQC4fPWn2YQYKCzobGo',
}