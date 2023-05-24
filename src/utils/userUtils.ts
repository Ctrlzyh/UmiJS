let userInfo = {
    "studentUuid":"",
    "studentName":"",
    "password":"",
    "roleType":0,
    "gender":0,
    "phoneNumber":"",
    "email":"",
    "department":"",
    "specialities":"",
    "className":"",
    "status":"",
    "loginCount":0,
    "useTimes":0,
    "lastLoginTime":"",
    "token":""
}

const setUserInfo = (info: any)=>{
    localStorage.setItem("userInfo", JSON.stringify(info))
}

const getUserInfo = () =>{
    const info = localStorage.getItem("userInfo")
    return  JSON.parse(info || "")
}

export default {setUserInfo, getUserInfo}

