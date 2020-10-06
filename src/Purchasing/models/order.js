import mongoose from "mongoose";
import shortid from "shortid";

let orderSchema = mongoose.Schema(
  {
    products: [
      {
        _id: false,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    code: {
      type: String,
      default: shortid.generate,
      required: true,
    },
    estimatedTime: {
      type: Number,
      default: 10,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
      required: true,
    },
    bazar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bazar",
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
      required: true,
    },
    state: {
      type: String,
      enum: [
        "CONFIRMATION PENDING",
        "REFUSED",
        "PAYMENT PENDING",
        "ACCEPTED",
        "CANCELED",
        "SHIPPED TO USER ADDRESS",
        "DELIVERED",
      ],
      default: "CONFIRMATION PENDING",
      required: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      defualt: "",
     //required:true,
      ref: "Payment",
    },
    paymentType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentType",
      required: true,
    },
    deliveryAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientAddresses",
      required: true,
    },
    note: String,
  },
  { timestamps: true, versionKey: false }
);

let OrderModel = mongoose.model("Order", orderSchema);

export { OrderModel };
