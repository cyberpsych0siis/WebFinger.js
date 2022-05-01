import mysql from 'mysql2';

const sql = mysql.createConnection({
    host: process.env.MYSQL_HOST ?? "localhost",
    user: process.env.MYSQL_USER ?? "root",
    password: process.env.MYSQL_PASS ?? "",
    database: process.env.MYSQL_DATABASE ?? "banana-msg"
});

export function query(q, data = []) {
    return new Promise((res, rej) => {
        sql.query(q, data, (err, dbData) => {
            if (err) rej(err.message);

            if (data.length == 0) rej("Not found")

            res(data);
        });
    });
}