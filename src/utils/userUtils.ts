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
    console.log('---123--->',JSON.stringify(info))
    // userInfo = info
    localStorage.setItem("userInfo", JSON.stringify(info))
}

const getUserInfo = () =>{
    // console.log('---userInfo->',userInfo)
    const info = localStorage.getItem("userInfo")
    //  console.log('---info->',JSON.parse(info))
    return  JSON.parse(info || "")
}

export default {setUserInfo, getUserInfo}

