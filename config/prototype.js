module.exports= {
  piping: true,
  port: 3005,
  db: {
    mongodb: {
      url : "mongodb://localhost:27017/sentences?auto_reconnect"
    },
    redis_session:{
        host: "localhost",
        port:3679,
        database_index: 0,
        password: ""
    }
  }
};