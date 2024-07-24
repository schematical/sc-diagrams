import React from "react";
import ReactGA from 'react-ga4';
import {decodeToken, isExpired} from "react-jwt";
import axios from "axios";
const getJwt = async () => {
    throw new Error("DONT USE THIS");
/*    const token = localStorage.getItem('accessToken');
    if (token) {
        const isMyTokenExpired = isExpired(token);
        if (!isMyTokenExpired) {
            return token;
        }
    }

    // localStorage.removeItem("accessToken");
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        return null; // throw new Error("Missing `refreshToken`");
    }
    // const decodedToken: any = decodeToken(token);
    const query = {
        username: localStorage.getItem('user'),
        refreshToken
    }
    const res = await axios.post(process.env.NEXT_PUBLIC_SERVER_URL + '/api/refresh', query);
    const newToken = res?.data?.accessToken;
    localStorage.setItem("accessToken", newToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    return newToken;*/
}
const trackClick = (event_name: 'join_group' | 'select_content', params: any) => {
    try {
        ReactGA.event(event_name, params);
    }catch(err) {
        console.error("trackClick Error: ", err);
    }

}
export {
    trackClick,
    getJwt
}