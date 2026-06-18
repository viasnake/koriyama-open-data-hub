from __future__ import annotations

project = "Civic Koriyama Data"
author = "viasnake"
copyright = "2026, viasnake"

language = "ja"
source_suffix = {
    ".md": "markdown",
}
master_doc = "index"
exclude_patterns = [
    "_build",
    "Thumbs.db",
    ".DS_Store",
    "operations.md",
    "sources.md",
]

extensions = [
    "myst_parser",
    "sphinx_copybutton",
]

myst_heading_anchors = 3
myst_enable_extensions = [
    "colon_fence",
    "deflist",
]

html_theme = "shibuya"
html_title = "Civic Koriyama Data ドキュメント"
html_short_title = "Civic Koriyama Data"
html_baseurl = "https://civic-koriyama-data.alflag.org/docs/"
html_static_path = ["_static"]
html_css_files = ["custom.css"]
html_copy_source = False
html_show_sourcelink = False
html_show_sphinx = False
html_theme_options = {
    "accent_color": "teal",
    "color_mode": "auto",
    "globaltoc_expand_depth": 1,
    "page_layout": "default",
    "github_url": "https://github.com/viasnake/civic-koriyama-data",
    "nav_links": [
        {
            "title": "API",
            "url": "https://civic-koriyama-data.alflag.org/api/v2",
            "external": True,
        },
        {
            "title": "GitHub",
            "url": "https://github.com/viasnake/civic-koriyama-data",
            "external": True,
        },
    ],
}
html_context = {
    "source_type": "github",
    "source_user": "viasnake",
    "source_repo": "civic-koriyama-data",
    "source_version": "master",
    "source_docs_path": "/docs/",
}
