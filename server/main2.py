import mdtex2html

with open("../data/1.md") as f:

    x  = mdtex2html.convert(f.read())
    with open("1.html", "w") as g:
        g.write(x)
