export async function fetchData(
  urlToFetchFrom: string,
  authState: any,
  postRequest: any = false,
  body: any = {}
) {
  let request;

  const data = body;

  if (postRequest) {
    request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authState?.accessToken}`,
        'accept-encoding': 'gzip',
      },
      body: JSON.stringify(data),
    };
  } else {
    request = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authState?.accessToken}`,
        'accept-encoding': 'gzip',
      },
    };
  }
  try {
    let response;

    if (request != null) response = await fetch(urlToFetchFrom, request);
    else response = await fetch(urlToFetchFrom);

    return [null, response] as const;
  } catch (error) {
    return [error, null] as const;
  }
}
