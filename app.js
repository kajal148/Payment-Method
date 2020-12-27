const express = require('express'),
app = express(),
bodyParser = require('body-parser'),
keys = require('./config/keys.js'),
stripe = require('stripe')(keys.stripeSecretKey);
const exphbs =  require('express-handlebars');
const port = process.env.PORT || 8080;

//middlewares
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//static folders
app.use(express.static(`${__dirname}/public`))

app.get('/',(req,res)=>{
    res.render("index",{
        stripePublishableKey:keys.stripePublishableKey
    })
})

app.post('/charge',(req,res)=>{
    const amount = 2500;
    stripe.customers.create({
        email:req.body.stripeEmail,
        source: req.body.stripeToken
    }).then(customer => stripe.charges.create({
        amount,
        description:'Ebook',
        currency:'inr',
        customer:customer.id
    })).then(charge =>{
        res.render('success');
    })
})

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})