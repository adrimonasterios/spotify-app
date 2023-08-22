export const requestSpotify = async (
  url: string,
  { token }: { [k: string]: string }
) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.log({ error });
  }
};
