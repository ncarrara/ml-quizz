import markdown

md = markdown.Markdown(extensions=['mdx_math'])
with open("3.html", "w") as g:
    g.write(md.convert('$$e^x$$'))