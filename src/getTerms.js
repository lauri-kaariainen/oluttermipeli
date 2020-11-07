export const getRealTerms = (string) => {
  return new Promise(
    (resolve, reject) =>
      fetch("//lauri.space/alko-product-api/products/" + string)
        .then((e) => e.json())
        // .then(e => (console.log(e), e))
        .then((e) =>
          resolve({
            name: e.data.attributes.name,
            type: e.data.attributes.type,
            terms: e.data.attributes.characterization
          })
        )
        .catch((err) => reject(err))
    //    resolve(["hennon mansikkainen", "tamminen", "kirsikkainen"])
  );
};
