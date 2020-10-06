import boom from "@hapi/boom";
import { getErrorMessage } from "../../../utils/handleDBError";
import { ProductModule } from "../../modules/product";
import { BazarModule } from "../../../ProviderManagement/modules/bazar";
import { ProviderModule } from "../../../ProviderManagement/modules/provider";
import { decodeTokenAndGetType } from "../../../utils/JWTHelper";
import { ClientModule } from "../../../CustomersManagement/modules/client";

const ProductController = {
  async addProduct(req, res, next) {
    let product = req.body;

    let bazarId = req.body.bazar,
      bazar = await BazarModule.getById(bazarId),
      providerId = bazar.provider,
      provider = await ProviderModule.getById(providerId);

    if (
      !provider.roles.includes("BAZAR_CREATOR") &&
      !provider.roles.includes("BAZAR_PRODUCTS_EDITOR")
    ) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
      return next(boom.unauthorized(errMsg));
    }

    product.isDeleted = false;
    product.bazarType = bazar.type;
    let productCover = "",
      productImages = [];
    if (req.files) {
      productCover =
        "http://api.bazar.alefsoftware.com/api/v1/products/product/products-images/" +
        req.files["productCover"][0].filename;
      console.log(req.files["productCover"][0].filename);
      if (req.files["productImages"]) {
        productImages = req.files["productImages"].map((img) => {
          return (
            "http://api.bazar.alefsoftware.com/api/v1/products/product/products-images/" +
            img.filename
          );
        });
      }
    }
    product.productCover = productCover;
    product.productImages = productImages;
    let savedProduct = await ProductModule.add(product);
    if (savedProduct.err)
      return next(
        boom.badData(
          getErrorMessage(savedProduct.err, req.headers.lang || "ar")
        )
      );

    return res.status(201).send({
      isSuccessed: true,
      data: savedProduct.doc,
      error: null,
    });
  },

  async getProducts(req, res, next) {
    let name = req.query.name,
      skip = parseInt(req.query.skip) || 0,
      limit = parseInt(req.query.limit) || 0,
      auth = req.headers.authentication,
      favs = [];

    let products = await ProductModule.getProducts(skip, limit, name);

    if (auth) {
      let decodeAuth = await decodeTokenAndGetType(auth);
      if (decodeAuth && decodeAuth.type == "CUSTOMER") {
        favs =await ClientModule.getFavProducts(decodeAuth.id);
      }
    }

    return res.status(200).send({
      isSuccessed: true,
      data: await addFavProp(
        products,
        favs
      ),
      error: null,
    });
  },

  async getStoreProducts(req, res, next) {
    let bazarId = req.params.id,
      auth = req.headers.authentication,
      favs = [],
      bazar = await BazarModule.getById(bazarId);
    if (!bazar) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? " Bazar not found" : " المحل غير موجود";
      return next(boom.unauthorized(errMsg));
    }
    let products = await ProductModule.getStoreProducts(bazarId);
    if (auth) {
      let decodeAuth = await decodeTokenAndGetType(auth);
      if (decodeAuth && decodeAuth.type == "CUSTOMER") {
        favs =await ClientModule.getFavProducts(decodeAuth.id);
      }
    }

  

    //console.log(products);
    //console.log(favs);
    return res.status(200).send({
      isSuccessed: true,
      data: await addFavProp(
        products,
        favs
      ),
      error: null,
    });
  },

  async updateProduct(req, res, next) {
    let id = req.query.productId;
    let newData = req.body;

    let bazarId = req.body.bazar,
      bazar = await BazarModule.getById(bazarId),
      providerId = bazar.provider,
      provider = await ProviderModule.getById(providerId),
      product = await ProductModule.getById(id);

    if (!product || product.bazar + "" !== bazarId) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "product not found" : "المنتج غير موجود";
      return next(boom.unauthorized(errMsg));
    }
    if (
      !provider.roles.includes("BAZAR_CREATOR") &&
      !provider.roles.includes("BAZAR_PRODUCTS_EDITOR")
    ) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
      return next(boom.unauthorized(errMsg));
    }
    if (req.files) {
      if (req.files["productCover"]) {
        let productCover =
          "http://api.bazar.alefsoftware.com/api/v1/products/product/products-images/" +
          req.files["productCover"][0].filename;
        newData.productCover = productCover;
      }

      if (req.files["productImages"]) {
        let productImages = req.files["productImages"].map((img) => {
          return (
            "http://api.bazar.alefsoftware.com/api/v1/products/product/products-images/" +
            img.filename
          );
        });
        newData.productImages = productImages;
      }
    }
    delete newData.bazar;
    let update = await ProductModule.updateProduct(id, newData);
    return res.status(200).send({
      isSuccessed: true,
      data: update,
      error: null,
    });
  },

  async deleteProduct(req, res, next) {
    let id = req.query.productId,
      bazarId = req.body.bazar,
      bazar = await BazarModule.getById(bazarId),
      providerId = bazar.provider,
      provider = await ProviderModule.getById(providerId),
      product = await ProductModule.getById(id);

    if (!product || product.bazar + "" !== bazarId) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "product not found" : "المنتج غير موجود";
      return next(boom.unauthorized(errMsg));
    }
    if (
      !provider.roles.includes("BAZAR_CREATOR") &&
      !provider.roles.includes("BAZAR_PRODUCTS_EDITOR")
    ) {
      let lang = req.headers.lang || "ar",
        errMsg = lang == "en" ? "you didn't have access" : "ليس لديك صلاحيات";
      return next(boom.unauthorized(errMsg));
    }

    let deleteProduct = await ProductModule.deleteProduct(id);
    return res.status(200).send({
      isSuccessed: true,
      data: deleteProduct,
      error: null,
    });
  },
};

async function addFavProp(products, userFav) {
  return await products.map((product) => {
    return Object.assign(product.toObject(), {
      isFav: userFav.some(item => item._id+"" === product._id+""),
    });
  });
}

export { ProductController };
