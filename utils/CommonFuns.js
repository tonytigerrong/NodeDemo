
const mysql = require('mysql');

class CommonFuns{
    constructor(){
        console.log("CommonFuns.constructor=>");
        this.connection = this.getConnection();
    }

    getConnection(){
        console.log("CommonFuns.getConnection=>");
        return mysql.createConnection({
                    host: 'localhost',
                    port: 3306,
                    user: 'root',
                    password: 'Abcd1234!',
                    database: 'crudapi'
                });
       
    }

    exeSql(sql){
        console.log(`CommonFuns.exeSql=>${sql}`);
        
        return 
            this.connection.query(sql,(err, rows, fields)=>{
                if(err){
                    return err;
                }else{
                    console.log("Query Result: ",rows);
                    return rows;
                }
    
            });
       
    }
}

module.exports = CommonFuns;