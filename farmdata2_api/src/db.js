import mariadb from 'mariadb'

const pool = mariadb.createPool({ 
    host: `fd2_mariadb`,
    user: 'farm',
    password: 'farm',
    database: 'farm'
})

export default pool