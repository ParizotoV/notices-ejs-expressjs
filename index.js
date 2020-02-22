const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const User = require('./models/user')
const Noticia = require('./models/noticia')

const noticias = require('./routes/noticias')
const restrito = require('./routes/restrito')
const auth = require('./routes/auth')
const pages = require('./routes/pages')
const admin = require('./routes/admin')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const mongo = process.env.MONGODB || 'mongodb://localhost/noticias'
const port = process.env.PORT || 3000

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(session({
	secret: 'fullstack-master',
	resave: true,
	saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/', auth)
app.use('/', pages)

app.use('/noticias', noticias)
app.use('/restrito', restrito)
app.use('/admin', admin)

const createInitialUser = async () => {
	const total = await User.countDocuments({})
	if (total === 0) {
		const user = new User({
			username: 'ParizotoV',
			password: 'abc123',
			roles: ['restrito', 'admin']
		})
		await user.save()
		const user1 = new User({
			username: 'user2',
			password: 'abc123',
			roles: ['restrito']
		})
		await user1.save()
	} else {
		console.log('User created skipped')
	}
	/* 
	const noticia = new Noticia({
		title: 'Noticia publica '+ new Date().getTime(),
		content: 'content',
		category: 'public'
	})
	await noticia.save()

	const noticia1 = new Noticia({
		title: 'Noticia privada '+ new Date().getTime(),
		content: 'content',
		category: 'private'
	})
	await noticia1.save()
	*/

}



mongoose.connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		createInitialUser()
		app.listen(port, (err) => {
			err ? console.log('Not running') : console.log('Running...')
		})
	})
	.catch(e => console.log(e))

