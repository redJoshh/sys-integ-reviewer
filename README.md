# System Integration Reviewer

A static reviewer site generated from the Markdown notes in `content-md-files/`.
`npm run build` writes the site to `dist/`. See `CLAUDE.md` for how the notes are
structured.

## Run it locally

```sh
npm install
npm run dev              # http://localhost:3000, rebuilds when notes or src/ change
npm run preview:pages    # same, served under /sys-integ-reviewer/ like GitHub Pages
```

## Deploy

The same build works on all three hosts. Only GitHub Pages needs a base path,
and its workflow sets that for you.

| Host         | Setup                                                                                          | Config file                          |
| ------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------ |
| Netlify      | Connect the repo (or drag `dist/` in).                                                         | `netlify.toml`                       |
| Vercel       | Import the repo at vercel.com/new. Leave the framework preset as "Other"; settings come from the config file. | `vercel.json`                        |
| GitHub Pages | Repo Settings → Pages → Source: **GitHub Actions**. Every push to `main` then deploys.          | `.github/workflows/deploy-pages.yml` |

### Build settings

| Variable    | What it does                                                                                  |
| ----------- | --------------------------------------------------------------------------------------------- |
| `BASE_PATH` | Folder the site is served from, such as `/sys-integ-reviewer`. Empty by default.              |
| `SITE_URL`  | Public URL used for canonical and Open Graph links. Netlify and Vercel provide one on their own. |

To build for a GitHub Pages project site by hand:

```sh
BASE_PATH=/sys-integ-reviewer SITE_URL=https://<user>.github.io/sys-integ-reviewer npm run build
```

In Git Bash on Windows, put `MSYS_NO_PATHCONV=1` in front, or Git Bash turns
`/sys-integ-reviewer` into a Windows path.

GitHub Pages can't send custom headers, so the caching and security headers in
`netlify.toml` and `vercel.json` only apply on those two hosts.
