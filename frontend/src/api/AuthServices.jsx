import axios from 'axios';

const register_URL = 'http://127.0.0.1:8000/parknplay/users';

export const sendNewlyCreatedUser = async (data) => {
    try {
        const response = await axios.post(register_URL, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const {data: {token}} = response;
        return token;
    } catch (error) {
        console.error(error);
    }
}

const login_URL = 'http://127.0.0.1:8000/parknplay/login';

export const sendUserLoginDetails = async (data) => {
    try {
        const response = await axios.post(login_URL, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const { data: { token }} = response;
        return token;
    } catch (error) {
        console.error(error);
    }
}

const new_password_URL = 'http://127.0.0.1:8000/parknplay/changePassword';
export const sendChangedPassword = async (data) => {
    try {
        const response = await axios.post(new_password_URL, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}