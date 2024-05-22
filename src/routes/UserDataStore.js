import { writable } from "svelte/store";


// type data = {user_email: string, api_key: string}

// function createUserStore(data : data){
//         const {subscribe, set, update} = writable(data)

//         function deleteData(){
//                 update(() => {data.api_key:null, data.user_email:null})
//         }

// }


const UserDataStore = writable({user_email:'',api_key:''})





export default UserDataStore;