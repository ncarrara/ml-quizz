var simplemde = new SimpleMDE({element: document.getElementById("mdarea")});
console.log("add.js")

function compile() {
    console.log("compile")
    $.post({
        traditional: true,
        url: '/compile',
        contentType: 'application/json',
        data: JSON.stringify({md: simplemde.value()}),
        dataType: 'json',
        success: function (response) {
            console.log(response);
            var html = ""
            for (row of response.rows) {
                if (row[0]) {
                    html += "<h3>solution</h3>"
                } else {
                    html += "<h3>question</h3>"
                }
                html += row[1]
            }
            document.getElementById("compiled_md").innerHTML = html;

        }
    });
    console.log(simplemde.value());
}

function submit() {
    console.log("submit")
    $.post({
        traditional: true,
        url: '/submit',
        contentType: 'application/json',
        data: JSON.stringify({md: simplemde.value()}),
        dataType: 'json',
        success: function (response) {
            $(location).attr('href', response.url);
        }
    });
}
