import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogPostsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: false },
    readTime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    author: {
      name: { type: String, required: false },
      avatar: { type: String, required: false },
    },
    content: { type: String, required: true },
    comments: [
      {
        comment: String,
        addedOn: Date,
        updatedOn: Date,
      },
    ],
  },
  { timestamps: true }
);
export default model("BlogPost", blogPostsSchema); // this model is now automagically linked to the "blogPosts" collection, if collection is not there it will be created
