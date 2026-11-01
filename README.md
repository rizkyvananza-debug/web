# No More Eurydice — Fan Site

A responsive Next.js fan-made landing page inspired by the gothic-romance atmosphere of *No More Eurydice*.

## Run locally

1. Install Node.js 18.17+.
2. Open this folder in a terminal.
3. Run:

```bash
npm install
npm run dev
```

4. Visit http://localhost:3000

## Deploy to Vercel

1. Create a new GitHub repository and upload these project files.
2. Sign in to [Vercel](https://vercel.com/) and choose **Add New → Project**.
3. Import the repository.
4. Vercel should detect Next.js automatically. Keep the default build settings.
5. Select **Deploy**.

No environment variables are required.

## Customize

- Main page and chapter sample data: `app/page.tsx`
- Colors, layout, responsive styles: `app/globals.css`
- Page title and description: `app/layout.tsx`

Replace sample chapter names with verified details and add official reading links if you want to link to a licensed platform. The character cards are abstract editorial placeholders, not official character art.

## Rights notice

This is an unofficial fan-made tribute. It is not affiliated with, endorsed by, or sponsored by the original creator, publisher, or rights holders. The title and related names belong to their respective owners. Do not upload copyrighted chapter scans or official artwork unless you have permission.


## Routes added
- `/pricing` — bot rental pricing and WhatsApp order link.
- `/aboutowner` — owner information for Andrew & Luke.

## Poster background
The homepage and added pages look for `public/poster.jpg`. Add an official poster image there only if you have permission or a license to use it. The code intentionally does not bundle a copied official poster. If `public` does not exist yet, create it and upload the image as `poster.jpg`.


## Visual direction
The updated styling uses a piano-and-lotus inspired palette: deep botanical green, muted sage, ivory, soft lotus pink, and antique gold. Piano music-note details are decorative. Add an authorized poster image at `public/poster.jpg` to use it as the page background.


## Uploaded visual assets
The `public/` folder contains image references supplied by the site owner:
- `piano-lotus-art.jpg` — primary piano and lotus hero/background image.
- `lotus-romance-art.jpg` — secondary romantic lotus artwork.
- `eurydice-manga-panel.jpg` and `eurydice-eyes-panel.jpg` — monochrome manga panels.
- `eurydice-character-art.jpg` — character artwork.
- `piano-music-texture.jpg` — piano/music texture.
These files were supplied in this conversation. Confirm you have permission to publish them on your public website.


## Recent homepage update

- Homepage hero now includes ORDER NOW (`/pricing`) and ABOUT OWNER (`/aboutowner`) buttons.
- Main Characters shows Kim Hee-jae and Han Garam with the supplied image URLs and descriptions.
- The reading room generates 213 chapter entries, grouped by the requested season ranges. Every READ NOW button opens `https://t.me/nomoreeurydicesubindo`.

### Editing chapter names, notes, and links

Open `app/page.tsx` and find `chapterOverrides` near the top. Add entries by chapter number, for example:

```ts
const chapterOverrides = {
  1: {
    title: "The First Note",
    note: "A melody begins where words fall silent.",
    href: "https://your-chapter-link.example"
  },
  2: { title: "A Quiet Promise", href: "https://your-next-link.example" }
};
```

If `href` is omitted, that chapter uses the Telegram channel link. The displayed default chapter names are placeholders; replace them with verified titles as desired.
