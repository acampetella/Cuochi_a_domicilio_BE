import mongoose, { Schema, model } from "mongoose";

const MenuSchema = new Schema(
  {
    cook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CookModel",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    courses: [
      {
        courseName: {
          type: String,
          required: true,
        },
        courseType: {
          type: String,
          required: true,
        },
        courseDescription: {
          type: String,
          required: false,
        },
        courseImage: {
          type: String,
          required: false,
        },
      },
    ],
  },
  {
    timestamps: true,
    strict: true,
  }
);

const MenusModel = model("MenuModel", MenuSchema, "menus");
export default MenusModel;
