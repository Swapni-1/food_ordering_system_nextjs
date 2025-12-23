import axios from "axios";

async function getUser(email :string){
    const {data : user} = await axios.get('/api/user/'+email);
    
    if(user.role === "ADMIN"){
        return true
    }

    return false
}

export {getUser}