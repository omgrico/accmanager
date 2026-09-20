# Account Vault

A small local desktop app for organizing your own Rockstar / Steam / Discord
account logins. Everything is stored on your own machine (Electron's local
storage) — nothing is ever sent anywhere.

## One-time setup (do this once)

1. **Create the private GitHub repo.**
   - Go to github.com → New repository → name it (e.g. `account-vault`) →
     set visibility to **Private** → Create.

2. **Push this project to it.**
   From this project folder:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/account-vault.git
   git push -u origin main
   ```

3. **Update `package.json`.**
   In the `"build" -> "publish"` section, replace `YOUR_GITHUB_USERNAME` with
   your actual GitHub username (and change `"repo"` if you named it
   something other than `account-vault`).

4. **Create the update token** (lets the installed app read releases from
   your private repo):
   - Go to github.com → Settings → Developer settings → Personal access
     tokens → Fine-grained tokens → Generate new token.
   - Limit it to **only this one repository**.
   - Under Permissions, set **Contents: Read-only**. Nothing else.
   - Generate, copy the token.
   - In your repo on GitHub: Settings → Secrets and variables → Actions →
     New repository secret → name it `UPDATE_TOKEN`, paste the token.
   - This token ends up embedded inside the shipped app so it can download
     new versions from the private repo. Because it's scoped to
     read-only access on this one repo, that's a low-risk thing to embed —
     but don't reuse a broad personal token for this.

5. **Invite your friend as a collaborator** on the private repo (Settings →
   Collaborators) if you want them to see the source too. They don't need
   to be a collaborator just to *use* the app — only to see the code.

## Releasing a new version

Whenever you want to push an update out to everyone running the app:

1. Bump the version number in `package.json` (e.g. `"version": "1.0.1"`).
2. Commit and push that change.
3. Tag and push the tag — this is what triggers the build:
   ```
   git add package.json
   git commit -m "Bump version to 1.0.1"
   git tag v1.0.1
   git push origin main
   git push origin v1.0.1
   ```
4. GitHub Actions builds the installer and portable exe automatically and
   publishes them as a GitHub Release. Takes a few minutes — check the
   "Actions" tab on your repo to watch it.
5. Every copy of the app already installed (yours and your friend's) checks
   for updates on launch and every couple of hours, downloads the new
   version quietly in the background, and shows a "Restart & Update" button
   in Settings once it's ready.

## Distributing the very first copy

Auto-update only works once an update-capable version is already installed.
For the first install, build locally and send your friend the installer:

```
npm install
npx electron-builder --win nsis --x64
```

The installer will be in `dist/AccountVault-Setup.exe`. Send them that once
(via the private repo's Releases page, a file share, whatever) — every
version after that updates itself.

## Local development

```
npm install
npm start
```
