const getUserDetailKeys = (address: string) => ["user", address];
const getArticleByIdKeys = (id: string) => ["article", id];
const getListOfArticlesByAddressKeys = (address: string) => [
  "articles",
  address,
];

export {
  getUserDetailKeys,
  getArticleByIdKeys,
  getListOfArticlesByAddressKeys,
};
