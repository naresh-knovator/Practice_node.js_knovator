const User = require("../model/userModel");
const Album = require("../model/albumModel");
const Photos = require("../model/albumPhotos");
const Url = require("../model/urlModel");
const validUrl = require("valid-url");
const shortid = require("shortid");
const config = require("config");
const expressAsyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const qr_code = require("qrcode");
const generateToken = require("../config/jwtToken");

const deleteUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findUser = await User.findOne({ id });
    if (findUser) {
      const user = await User.findOneAndDelete({ id });
      const albums = await Album.find({ userId: id });
      for (let album of albums) {
        await Album.findOneAndDelete({ id: album.id });
      }
      res.json({
        status: "success",
        message: "User and associated albums are deleted",
        user: user,
        albums: albums,
      });
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const createUser = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (!findUser) {
      const newUser = await User.create(req.body);
      res.json({
        status: "success",
        user: newUser,
      });
    } else {
      throw new Error("User Already Added");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const loginUser = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (findUser) {
      res.json({
        status: "success",
        user: findUser,
        token: generateToken(findUser.id),
      });
    } else {
      throw new Error("No User Found");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const updateUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findUser = await User.findOne({ id });
    {
      if (findUser) {
        const user = await User.findOneAndUpdate({ id }, req.body, {
          new: true,
        });
        res.json({
          status: "success",
          user,
        });
      } else {
        throw new Error("There is no User Here");
      }
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUser = expressAsyncHandler(async (req, res) => {
  try {
    const user = await User.find();
    res.json({
      status: "success",
      result: user.length,
      users: user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const sendMailer = expressAsyncHandler(async (req, res) => {
  try {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>',
      to: "nareshchudasama@knovator.in",
      subject: "Hello ✔",
      text: "Naresh Chudasama",
    });
    res.json({ info, ResponseUrl: nodemailer.getTestMessageUrl(info) });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUserAgg = expressAsyncHandler(async (req, res) => {
  try {
    const album = await Album.aggregate([
      {
        $match: { userId: 1 },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "id",
          localField: "userId",
          as: "user",
        },
      },
      //   {
      //     $group: {
      //       _id: user.id,
      //       count: { $count: {} },
      //       sum: { $sum: { id: user.id } },
      //     },
      //   },
      //   {
      //     $unwind: { path: "$address" },
      //   },
    ]);
    res.json(album);
  } catch (error) {
    throw new Error(error);
  }
});

const createAlbumOfUser = expressAsyncHandler(async (req, res) => {
  const { id, userId, title } = req.body;
  try {
    const user = await User.findOne({ id: userId });
    if (user) {
      const findAlbum = await Album.findOne({ id });
      if (!findAlbum) {
        const album = await Album.create({
          id,
          title,
          user: { id: user.id, name: user.name },
        });
        res.json({
          id: album.id,
          title: album.title,
          user: {
            id: user.id,
            name: user.name,
          },
        });
      } else {
        throw new Error("Album Already Created");
      }
    } else {
      throw new Error("There is no User Here");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const createAlbumOfUserwithParams = expressAsyncHandler(async (req, res) => {
  const { id, title } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findOne({ id: userId });
    if (user) {
      const findAlbum = await Album.findOne({ id });
      if (!findAlbum) {
        const album = await Album.create({ userId, id, title });
        res.json({
          status: "success",
          album,
        });
      } else {
        throw new Error("Album Already Created");
      }
    } else {
      throw new Error("There is no User Here");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getAllAlbum = expressAsyncHandler(async (req, res) => {
  try {
    const album = await Album.find();
    res.json({
      status: "success",
      result: album.length,
      users: album,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getUserAlbum = expressAsyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ id: Number(userId) });
    const albums = await Album.find({ userId });
    const titles = albums.map((album) => {
      return album.title;
    });
    res.json({
      status: "success",
      User: [
        {
          userId: user.id,
          name: user.name,
          albums: titles,
        },
      ],
    });
  } catch (error) {
    throw new Error(error);
  }
});

const albumPhotos = expressAsyncHandler(async (req, res) => {
  const { albumId } = req.params;
  const file = req.file;
  // console.log(">>>>>>>>",file)
  const { id, url, thumbnailUrl } = req.body;
  try {
    const findAlbum = await Album.findOne({ id: albumId });
    if (findAlbum) {
      const photo = await Photos.findOne({ id });
      if (!photo) {
        const newPhotos = await Photos.create({
          albumId,
          id,
          title: findAlbum.title,
          url: file.filename,
        });
        res.json({
          status: "success",
          Photos: {
            albumId: Number(albumId),
            id: newPhotos.id,
            title: findAlbum.title,
            url: file.filename,
            // url: newPhotos.url,
            // thumbnailUrl: newPhotos.thumbnailUrl
          },
        });
        await newPhotos.save();
      } else {
        throw new Error("Album Photos Already Added");
      }
    } else {
      throw new Error("There is No Album Here");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const getAllAlbumPhotos = expressAsyncHandler(async (req, res) => {
  try {
    const photo = await Photos.find();
    res.json({
      status: "success",
      result: photo.length,
      Photos: photo,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const barcodeGenerater = expressAsyncHandler(async (req, res) => {
  try {
    const url = req.body.url;
    console.log(url);
    if (url) {
      qr_code.toDataURL(url, function (error, src) {
        if (error) {
          throw new Error(error);
        }
        var file_path = "public/barcode/" + Date.now() + ".png";
        qr_code.toFile(file_path, url, {
          color: {
            dark: "#000", // Black dots
            light: "#0000", // Transparent background
          },
        });
        res.render("index", { QR_code: src, img_src: file_path });
      });
    } else {
      throw new Error("URL Not Set!");
    }
  } catch (error) {
    throw new Error(error);
  }
});

const shortenerUrl = expressAsyncHandler(async (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = config.get("baseUrl");
  try {
    // Check base url
    if (!validUrl.isUri(baseUrl)) {
      throw new Error("Invalid base url");
    }
    // Create url code
    const urlCode = shortid.generate();

    if (validUrl.isUri(longUrl)) {
      try {
        let url = await Url.findOne({ longUrl });
        if (url) {
          res.json(url);
        } else {
          const shortUrl = baseUrl + "/" + urlCode;
          url = new Url({
            longUrl,
            shortUrl,
            urlCode,
            date: new Date(),
          });

          await url.save();
          res.json({ status: "success", url });
        }
      } catch (error) {
        throw new Error(error);
      }
    } else {
      throw new Error("Invalid long url");
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUser,
  sendMailer,
  loginUser,
  getAllUserAgg,
  createAlbumOfUser,
  createAlbumOfUserwithParams,
  getAllAlbum,
  getUserAlbum,
  albumPhotos,
  getAllAlbumPhotos,
  barcodeGenerater,
  shortenerUrl,
};
