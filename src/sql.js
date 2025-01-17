import mysql from 'mysql2';

export default class SqlSingleton {
    static sql = mysql.createConnection({
        host: process.env.MYSQL_HOST ?? "localhost",
        user: process.env.MYSQL_USER ?? "root",
        password: process.env.MYSQL_PASS ?? "",
        database: process.env.MYSQL_DATABASE ?? "banana-msg"
    });

    static setSql(sql) {
        this.sql = sql;
    }

    static query(q, data = []) {
        return new Promise((res, rej) => {
            SqlSingleton.sql.query(q, data, (err, dbData) => {
                if (err) { 
                    rej(err.message);
                    return;
                }
    
                if (data.length == 0) {
                    rej(new Error("Not found in database"))
                    return;
                }

                console.log(data);
    
                res(data);
            });
        });
    }
}