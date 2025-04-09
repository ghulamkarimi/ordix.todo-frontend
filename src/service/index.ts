import axios from 'axios';
import { TUser } from '../interface/index';

const SERVER_URL =
  import.meta.env.DEV
    ? 'http://localhost:5000/api' // beim lokalen Dev-Start
    : 'http://backend:5000/api'; // im Docker-Container

const axiosInstance = axios.create({
  baseURL: SERVER_URL, //  wird korrekt genutzt
  withCredentials: true, //  wichtig für session cookie
});

//  KEINE SERVER_URL hier — nur Pfad!
export const userRegister = async (user: TUser) => {
  return axiosInstance.post('/auth/register', user);
};

export const getUsers = async () => {
  return axiosInstance.get('/auth/users');
};

export const userLogin = async (user: TUser) => {
  return axiosInstance.post('/auth/login', user);
};

export const getCurrentUser = async () => {
  return axiosInstance.get('/auth/user');
};

export const userLogout = async () => {
  return axiosInstance.post('/auth/logout');
};

export const getTasks = async () => {
    return axiosInstance.get('/tasks/all')
      .then((res) => {
        console.log(" TASKS:", res.data);
        return res.data; // Nur die Daten zurückgeben
      })
      .catch((err) => {
        console.error("Axios TASKS ERROR", err);
        throw err;
      });
};
  

export const getLists = async () => {
  return axiosInstance.get('/lists')
    .then((res) => {
      console.log(" LISTS:", res.data);
      return res.data; // Nur die Daten zurückgeben
    })
    .catch((err) => {
      console.error(" Axios LISTS ERROR", err);
      throw err;
    });
};
