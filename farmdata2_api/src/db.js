import mariadb from 'mariadb'

const pool = mariadb.createPool({
    host: '172.18.0.2',  
    user: 'farm',
    password: 'farm',
    database: 'farm'
})

export default pool