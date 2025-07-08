<a href="https://www.easyedit.io/">
  <img alt="EasyEdit" src="./public/og-image.png">
  <h1 align="center">EasyEdit</h1>
</a>

<p align="center">
  Edit images with a single prompt. Powered by Flux through KatonAI.
</p>

## Tech stack

- Flux Kontext from BFL for the image model
- [KatonAI](https://api.katonai.dev) for inference
- Next.js app router with Tailwind
- Helicone for observability
- Plausible for website analytics

## Cloning & running

1. Clone the repo: `git clone https://github.com/Nutlope/easyedit`
2. Create a `.env.local` file and add your KatonAI API configuration:
   ```
   BASE_URL=https://your-katonai-endpoint.com
   API_KEY=your-api-key
   ```
3. Run `npm install` and `npm run dev` to install dependencies and run locally
