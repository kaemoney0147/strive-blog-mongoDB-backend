import express from "express";
import createHttpError from "http-errors";
import BlogPostsModel from "./model.js";

const blogPostRouter = express.Router();

blogPostRouter.post("/", async (req, res, next) => {
  try {
    req.body.author.avatar = `https://ui-avatars.com/api/?name=${req.body.author.name}`;

    const blogPost = {
      ...req.body,
    };

    const newBlogPost = new BlogPostsModel(blogPost);
    // here it happens validation (thanks to Mongoose) of req.body, if it is not ok Mongoose will throw an error
    // if it is ok the blogPost is not saved yet
    const { _id } = await newBlogPost.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogPostRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await BlogPostsModel.find();
    res.send(blogPosts);
  } catch (error) {
    next(error);
  }
});

blogPostRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const blogPost = await BlogPostsModel.findById(req.params.blogPostId);
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(
        createHttpError(
          404,
          `BlogPost with id ${req.params.blogPostId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostRouter.put("/:blogPostId", async (req, res, next) => {
  try {
    const updatedBlogPost = await BlogPostsModel.findByIdAndUpdate(
      req.params.blogPostId, // WHO you want to modify
      req.body, // HOW you want to modify
      { new: true, runValidators: true } // options. By default findByIdAndUpdate returns the record pre-modification. If you want to get back the newly updated record you shall use new:true
      // By default validation is off in the findByIdAndUpdate --> runValidators:true
    );

    // ****************************************** ALTERNATIVE METHOD ********************************************
    /*     const blogPost = await BlogPostsModel.findById(req.params.blogPostId)
    // When you do a findById, findOne,.... you get back a MONGOOSE DOCUMENT which is NOT a normal object
    // It is an object with superpowers, for instance it has the .save() method that will be very useful in some cases
    blogPost.age = 100
    await blogPost.save() */

    if (updatedBlogPost) {
      res.send(updatedBlogPost);
    } else {
      next(
        createHttpError(
          404,
          `BlogPost with id ${req.params.blogPostId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostRouter.delete("/:blogPostId", async (req, res, next) => {
  try {
    const deletedBlogPost = await BlogPostsModel.findByIdAndDelete(
      req.params.blogPostId
    );

    if (deletedBlogPost) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `BlogPost with id ${req.params.blogPostId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default blogPostRouter;
