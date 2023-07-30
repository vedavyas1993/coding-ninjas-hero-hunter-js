// function for timestamp and hash generation
function tsAndHash() {
  let ts = Date.now();
  let hash = CryptoJS.MD5(
    ts +
      "31ae0263348c45192241c66356f2a13e35a9c47b" +
      "d2f97728c6c92cd4cf6452b07f556304"
  ).toString();
  return { ts, hash };
}

async function getCharacters() {
  const { ts, hash } = tsAndHash();

  console.log(ts, hash);
  const response = await axios.get(
    `http://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=d2f97728c6c92cd4cf6452b07f556304&hash=${hash}`
  );
  console.log(response);
}
getCharacters();
