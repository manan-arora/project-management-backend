import dotenv from "dotenv";

dotenv.config({path:"./.env"});

let myusername = process.env.myusername;

console.log(`username is ${myusername}`);

console.log("Start of backend project");
