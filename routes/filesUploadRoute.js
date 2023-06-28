import express from "express";
import multer from "multer";
import cloudinaryModule from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();
const cloudinary = cloudinaryModule.v2;

const uploads = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_APY_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudResumesStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "homeCooks/resumes",
    format: async (req, file) => "pdf",
    public_id: (req, file) => file.name
  }
});

const cloudResumesUpload = multer({ storage: cloudResumesStorage });

const cloudAvatarsStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "homeCooks/avatars",
    format: async (req, file) => "png",
    public_id: (req, file) => file.name
  }
});

const cloudAvatarsUpload = multer({ storage: cloudAvatarsStorage });

const cloudCoursesImagesStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "homeCooks/coursesImages",
    format: async (req, file) => "png",
    public_id: (req, file) => file.name
  }
});

const cloudCoursesImagesUpload = multer({ storage: cloudCoursesImagesStorage });

const cloudCoversStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "homeCooks/covers",
    format: async (req, file) => "png",
    public_id: (req, file) => file.name
  }
});

const cloudCoversUpload = multer({ storage: cloudCoversStorage });

uploads.post(
  "/resumeUpload",
  cloudResumesUpload.single("resume"),
  async (req, res) => {
    try {
      res.status(200).json({ resume: req.file.path });
    } catch (error) {
      res.status(500).send({
        message: "Upload file error",
        statusCode: 500
      });
    }
  }
);

uploads.post(
    "/avatarUpload",
    cloudAvatarsUpload.single("img"),
    async (req, res) => {
      try {
        res.status(200).json({ img: req.file.path });
      } catch (error) {
        res.status(500).send({
          message: "Upload file error",
          statusCode: 500
        });
      }
    }
  );

  uploads.post(
    "/courseImageUpload",
    cloudCoursesImagesUpload.single("img"),
    async (req, res) => {
      try {
        res.status(200).json({ img: req.file.path });
      } catch (error) {
        res.status(500).send({
          message: "Upload file error",
          statusCode: 500
        });
      }
    }
  );

  uploads.post(
    "/coverUpload",
    cloudCoversUpload.single("img"),
    async (req, res) => {
      try {
        res.status(200).json({ img: req.file.path });
      } catch (error) {
        res.status(500).send({
          message: "Upload file error",
          statusCode: 500
        });
      }
    }
  );

export default uploads;
