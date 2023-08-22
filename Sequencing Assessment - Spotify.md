# spotify-autocomplete

Fans of music are always looking for something new to listen to.
For this exercise, you will be using the Spotify public api to build out a search experience.

https://developer.spotify.com/documentation/web-api/

This exercise is left fairly open by intention. Treat this as a production level feature where you will be assessed on both code quality as well as your ability to interpret and refine requirements. Be sure to structure your commits logically in such a manner that a fellow team member would fall into a pit of success if they were to have to modify your code.

## Requirements

As a user, I would like to:

- [x] Enter text into an input field and be given a list of suggestions of artist, albums, and tracks that match my query
- [x] Be given continuously updated search suggestions as I type without having to wait until I've pressed `enter`
  - [x] As an example, note how Google search provides continuous feedback while typing into their search field
- [x] Be shown my search suggestions in a grid, separated by artist, albums, and tracks. Each grid item should show a relevant photo and text
  - [x] For artists, the image should be the artist photo and the text should be the artist name
  - [x] For albums, the image should be the album artwork and the text should be the album name
  - [x] For tracks, the image should be the album artwork on which the track appears, and the text should be the track name
- [x] Initially be shown at most 5 results per category
- [] Be able to page through each category of results to be shown additional suggestions, 10 at a time
- [] See relevant metadata when clicking on a search suggestion in either a sidebar, a modal or a separate page
  - [] For artists, I would like to see the artist photo, the artist name, and a list of albums (both the album artwork and name) released by the artist
  - [] For albums, I would like to see the album artwork, the album name, the release date, and a list of tracks and track length of songs that appear on the album
  - [] For tracks, I would like to see the album artwork on which the track appears, the name of the album, the release date of the album, the name of the track, and the track length
- [] Have my search results formatted appropriately based on my screen size (i.e. this should be a responsive application). Grid size and breakpoints based on screen resolution are left up to you

You are free to use any framework or library of your choosing, with the exception of any spotify api wrappers. These endpoints are simple enough that you should be able to make the requests and parse the results without the aid of a third party library.

You do not need to support Internet Explorer.

## Acceptance Criteria

- [] Application must satisify the above listed criteria
- [] Applications must be well structured with clear separation of concerns. Code must be representative of production level quality.
- [] Application must contain documentation on how to build and run the app. Apps that do not build and run on our machines will not be considered.
- [] Commits must be clear in their intent and well structured
- [] If you made any design decisions of note, please document them with rational as to why that decision was made

## Other Considerations

- [] Spotify will throttle their api if you make too many requests in a 30 second period. How would you avoid making too many requests?
