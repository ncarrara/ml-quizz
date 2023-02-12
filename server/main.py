from markdown_katex import tex2html
import markdown

md_ctx = markdown.Markdown(
    extensions=[
        'markdown.extensions.toc',
        'markdown.extensions.extra',
        'markdown.extensions.abbr',
        'markdown_katex',
    ],
    extension_configs={
        'markdown_katex': {
            # 'no_inline_svg': True,      # fix for WeasyPrint
            # 'insert_fonts_css': True,
        },
    }
)

md_ctx.convertFile("../data/0.md","0.html")