This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The only environment variable needed is NEXT_PUBLIC_SPOTIFY_CLIENT_ID

You can copy the .env.example file and create a new .env.local file with the environment variable

## Application Details

This application was done with TailwindCSS.

The idea is having a searchbar at the home screen where one can see quick data about artists, albums or tracks by clicking on any of the results. These results are fetched from the Spotify API using debouncing so we limit the amount of requests we make to the external api. We wait 500 miliseconds after the user has stopped typing to make a request.

If the user wants to see more results for either artists, albums or tracks they can click on the "More" button next to the category title.

To do a new search, the user needs to go back to the home page by clicking on the Home button at the top left of the screen in the results page.

The application works with a Spotify Authentication provider that handles the token and refresh token with react hooks and passes the information through context and stores the same information in the localStorage.
