import bcrypt from 'bcryptjs'

const users =[
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'Christian Ruiz',
        email: 'christianruiz@foodteamexpress.com',
        password: bcrypt.hashSync('123456', 10),
        isSeller: true
    },
    {
        name: 'Yeferson Pulgarin',
        email: 'yefersonpulgarin@foddteamexpress.com',
        password: bcrypt.hashSync('123456', 10),
        isSeller: true
    }
]

export default users