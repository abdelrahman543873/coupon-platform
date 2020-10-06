import { ProductModel } from "../models/product";

const ProductModule = {
  async getById(id) {
    return await ProductModel.findById(id);
  },

  async getProducts(skip = 1, limit = 1, name = "") {
    let queryOp = {};
    queryOp.isDeleted = false;
    if (name !== "") {
      queryOp.$or = [
        {
          nameEn: new RegExp(name, "i"),
        },
        {
          nameAr: new RegExp(name, "i"),
        },
      ];
    }
    return await ProductModel.find({
      ...queryOp,
    })
      .populate('bazar','name logoURL')
      .populate('offer')
      .skip(skip)
      .limit(limit)
      .catch((err) => {
        console.log(err);
        return [];
      });
  },

  async getStoreProducts(bazarId) {
    return await ProductModel.find({
      bazar: bazarId,
      isDeleted: false,
    }).populate("bazar", 'name logoURL');
  },
  async getStoreProductsCount(bazarId) {
    return await ProductModel.countDocuments({
      bazar: bazarId,
      isDeleted: false,
    });
  },
  async getStoresProductsCount() {
    return await ProductModel.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        $project: {
          bazar: 1,
          _id: 0,
        },
      },
      {
        $group: {
          _id: "$bazar",
          count: {
            $sum: 1,
          },
        },
      },
    ]);
  },
  async add(product) {
    return await ProductModel({
      ...product,
    })
      .save()
      .then((doc) => {
        return {
          doc,
          err: null,
        };
      })
      .catch((err) => {
        return {
          doc: null,
          err: err,
        };
      });
  },

  async updateProduct(id, productData) {
    let product = await ProductModel.findById(id);

    if (!productData.productImages) {
      productData.productImages = [];
    }

    productData.productImages = productData.productImages.concat(
      product.productImages
    );

    if (productData.deleteImg) {
      productData.productImages = productData.productImages.filter((img) => {
        if (!productData.deleteImg.includes(img)) return img;
      });
      delete productData.deleteImg;
    }
    return await ProductModel.findByIdAndUpdate(
      id,
      {
        $set: { ...productData },
      },
      { new: true }
    ).catch((err) => {
      console.log(err);
      return { err: err };
    });
  },

  async deleteProduct(id) {
    return await ProductModel.findByIdAndUpdate(
      id,
      {
        $set: { isDeleted: true },
      },
      { new: true }
    ).catch((err) => {
      console.log(err);
      return { err: err };
    });
  },
};

export { ProductModule };
