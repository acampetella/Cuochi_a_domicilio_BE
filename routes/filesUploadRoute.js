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

const internalResumesStorage = multer.diskStorage({
    destination: (req, file , cb) => {
      cb(null, 'uploads/resumes');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExt = file.originalname.split('.').pop();
      cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`)
    }
  });
  
  const internalResumesUpload = multer({storage: internalResumesStorage});

  const internalCoversStorage = multer.diskStorage({
    destination: (req, file , cb) => {
      cb(null, 'uploads/covers');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExt = file.originalname.split('.').pop();
      cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`)
    }
  });
  
  const internalCoversUpload = multer({storage: internalCoversStorage});

  const internalCoursesImagesStorage = multer.diskStorage({
    destination: (req, file , cb) => {
      cb(null, 'uploads/coursesImages');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExt = file.originalname.split('.').pop();
      cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`)
    }
  });
  
  const internalCoursesImagesUpload = multer({storage: internalCoursesImagesStorage});

  const internalAvatarsStorage = multer.diskStorage({
    destination: (req, file , cb) => {
      cb(null, 'uploads/avatars');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExt = file.originalname.split('.').pop();
      cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`)
    }
  });
  
  const internalAvatarsUpload = multer({storage: internalAvatarsStorage});


uploads.post(
  "/cloud/resumeUpload",
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
    "/cloud/avatarUpload",
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
    "/cloud/courseImageUpload",
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
    "/cloud/coverUpload",
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

  uploads.post('/internal/resumeUpload', internalResumesUpload.single('resume'), 
    async (req, res) => {
    const url = req.protocol + '://' + req.get('host');

    try {
        const imgUrl = req.file.filename;
        res.status(200).json({
            resume: `${url}/uploads/resumes/${imgUrl}`
        })
    } catch (error) {
        res.status(500).send({
            message: 'File upload error',
            statusCode: 500
        })
        
    }
  });

  uploads.post('/internal/coverUpload', internalCoversUpload.single('img'), 
    async (req, res) => {
    const url = req.protocol + '://' + req.get('host');

    try {
        const imgUrl = req.file.filename;
        res.status(200).json({
            img: `${url}/uploads/covers/${imgUrl}`
        })
    } catch (error) {
        res.status(500).send({
            message: 'File upload error',
            statusCode: 500
        })
        
    }
  });

  uploads.post('/internal/avatarUpload', internalAvatarsUpload.single('img'), 
    async (req, res) => {
    const url = req.protocol + '://' + req.get('host');

    try {
        const imgUrl = req.file.filename;
        res.status(200).json({
            img: `${url}/uploads/avatars/${imgUrl}`
        })
    } catch (error) {
        res.status(500).send({
            message: 'File upload error',
            statusCode: 500
        })
        
    }
  });

  uploads.post('/internal/coursesImagesUpload', internalCoursesImagesUpload.single('img'), 
    async (req, res) => {
    const url = req.protocol + '://' + req.get('host');

    try {
        const imgUrl = req.file.filename;
        res.status(200).json({
            img: `${url}/uploads/coursesImages/${imgUrl}`
        })
    } catch (error) {
        res.status(500).send({
            message: 'File upload error',
            statusCode: 500
        })
        
    }
  });

export default uploads;
