const tm = require('markdown-it-texmath');
const md = require('markdown-it')({html: true})
    .use(tm, {
        engine: require('katex'),
        delimiters: 'dollars',
        katexOptions: {macros: {"\\RR": "\\mathbb{R}"}}
    });
// const data = "Euler\'s identity $e^{i\\pi}+1=0$ is a beautiful formula in $\\RR^2$.";

const fs = require('fs');

const express = require('express')


const app = express()
app.set("view engine", "ejs")
app.use(express.static(__dirname + '/public'));
const port = 3000


try {
    // const markdownData = fs.readFileSync('../data/euler.md', 'utf8');
    // var data = md.render(markdownData);

    app.get('/', function (req, res) {
        const markdownData = fs.readFileSync('../data/euler.md', 'utf8');
        var data = md.render(markdownData);
        res.render('template', {user: "John", data: data});
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
} catch (err) {
    console.error(err);
}


