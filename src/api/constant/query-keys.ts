const getUserDetailKeys = (address: string) => ["user", address];
const getArticleByIdKeys = (id: string) => ["article", id];
const getListOfArticlesByAddressKeys = (address: string) => [
  "articles",
  address,
];
const getTopLikesKeys = () => ["top-likes"];
const getAllCategoriesKeys = () => ["categories"];

export {
  getUserDetailKeys,
  getArticleByIdKeys,
  getListOfArticlesByAddressKeys,
  getTopLikesKeys,
  getAllCategoriesKeys
};
