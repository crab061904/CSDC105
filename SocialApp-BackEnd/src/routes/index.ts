// index.ts in the routes folder
import { createUser,getUserProfile,getAllUsers, updateUser, deleteUser }from  './login.route'; 

import { loginUser } from './auth.route'; 


export { createUser, getUserProfile, getAllUsers, updateUser, deleteUser, loginUser };

export { default as authRoutes } from './auth.route';

