const tm = require('markdown-it-texmath');
const md = require('markdown-it')({html: true})
    .use(tm, {
        engine: require('katex'),
        delimiters: 'dollars',
        katexOptions: {macros: {"\\RR": "\\mathbb{R}"}}
    });
const fs = require('fs');

const express = require('express')
var readlines = require('n-readlines');
const app = express()
app.set("view engine", "ejs")
app.use(express.static(__dirname + '/public'));
const port = 8085

function parse(file) {
    var liner = new readlines(file);
    var next;

    const rows = []
    var txt = ""
    var lastKey = ""
    while (next = liner.next()) {
        var line = next.toString('ascii')
        if (line[0] === '%' && line[1] === '%' && line[2] === '%') {
            var split = line.split("%%%")
            const key = split[1]
            console.log(`txt="${txt}"`)
            if (txt !== "" && txt !== '\n' && txt !== "\n\n") {
                rows.push([lastKey === "solution", md.render(txt)])
            }
            lastKey = key
            txt = ""
        } else {
            txt += '\n' + line
        }
    }
    rows.push([lastKey === "solution", md.render(txt)])
    console.log(rows)
    return rows
}

try {
    app.get('/', function (req, res) {
        res.redirect(`/random`)
    })

    app.get('/random', function (req, res) {
        res.redirect(`/${Math.floor(Math.random() * 3)}`)
    })

    app.get('/:questionId', function (req, res) {
        console.log(req.params)
        const rows = parse(`../data/${req.params.questionId}.md`)
        let metadata = JSON.parse(fs.readFileSync(`../data/${req.params.questionId}.json`));
        var data = {
            "rows": rows,
            "metadata": metadata
        }
        res.render('template', {user: "John", data: data});
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
} catch (err) {
    console.error(err);
}



