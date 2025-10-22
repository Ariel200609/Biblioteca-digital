import Server from "./app";

const server = new Server(3000);
server.start(()=>{
    console.log("on port 3000");
    
})