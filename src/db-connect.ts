import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
	name: 'default',
	type: 'mysql',
	host: process.env.DB_HOST,
	port: +(process.env.DB_PORT || 3306),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: true, // false for production
	logging: true,
	entities: [
		__dirname + '/entitys/*.js',
	],
});

// export const dbInit = async (app) => {
// 	createConnection({
// 							 type: 'mysql', // тип базы данных
// 							 host: '127.0.0.1', // адрес базы данных
// 							 порт: 3306, // номер порта базы данных
// 							 username: 'root', // имя пользователя базы данных
// 							 пароль: 'root', // пароль
// 							 database: 'node', // имя базы данных
// 							 entity: [__dirname + '/ entity / *. ts', 'dist / data / entity / *. js'], // вводим объекты
// 			synchronize: true,
// 	}).then((conn: any) => {
// 							 console.log ('Подключение к базе данных выполнено успешно')
// 			app.listen(3000)
// 							 dao.UserDao.addUser () // вызов метода - добавление пользователя
// 							 console.log ('Приложение успешно запущено')
// 			return true
// 	}).catch((error: any) => {
// 							 console.log ('не удалось запустить приложение')
// 			console.log(error)
// 			return false
// 	})
// }