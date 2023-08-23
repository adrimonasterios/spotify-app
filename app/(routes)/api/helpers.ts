export const requestSpotify = async (url: string, authorization: string) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1${url}`, {
      headers: {
        Authorization: authorization,
      },
    });

    return await response.json();
  } catch (error) {
    console.log({ error });
  }
};
