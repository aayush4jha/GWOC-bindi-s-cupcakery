import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

// MongoDB connection string from your environment
const mongoURI = 'mongodb+srv://tarun02185:oT886qfJNfRebquW@cluster0.02kzr.mongodb.net/bindi';

// Create storage engine for GridFS
const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: 'paymentScreenshots',
      filename: `${req.user._id}_${Date.now()}_${file.originalname}`
    };
  }
});

// Setup multer with GridFS storage
const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Create GridFS bucket for file operations
let gfs;
const connectGridFS = (db) => {
  gfs = new GridFSBucket(db, {
    bucketName: 'paymentScreenshots'
  });
};

// Get file from GridFS by ID
const getFileById = (id) => {
  return new Promise((resolve, reject) => {
    if (!gfs) {
      return reject(new Error('GridFS not initialized'));
    }
    
    const _id = new mongoose.Types.ObjectId(id);
    const downloadStream = gfs.openDownloadStream(_id);
    
    const chunks = [];
    downloadStream.on('data', (chunk) => {
      chunks.push(chunk);
    });
    
    downloadStream.on('error', (err) => {
      reject(err);
    });
    
    downloadStream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });
  });
};

// Delete file from GridFS by ID
const deleteFileById = (id) => {
  return new Promise((resolve, reject) => {
    if (!gfs) {
      return reject(new Error('GridFS not initialized'));
    }
    
    const _id = new mongoose.Types.ObjectId(id);
    gfs.delete(_id, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

export {
  uploadMiddleware,
  connectGridFS,
  getFileById,
  deleteFileById
};