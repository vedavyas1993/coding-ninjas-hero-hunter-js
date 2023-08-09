export function tsAndHash() {
  let ts = Date.now();
  let hash = CryptoJS.MD5(
    ts +
      "31ae0263348c45192241c66356f2a13e35a9c47b" +
      "d2f97728c6c92cd4cf6452b07f556304"
  ).toString();
  return { ts, hash };
}
