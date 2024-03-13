const sessionIdToUseMap = new Map();

function setUser(user,id){
    sessionIdToUseMap.set(user,id);
}


function getUser(id){
    return sessionIdToUseMap.get(id);
}

export default {setUser,getUser};