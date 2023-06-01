const express = require("express");
const router = express.Router();
const app = express();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const {
  index,
  addcategory,
  subcategory,
  addfabric,
  addbrand,
  addsize,
  catalog,
  category_delete,
  category_edit,
  delete_subcategory,
  subcategory_edit,
  fabric_edit,
  fabric_hide,
  brand_edit,
  brand_hide,
  size_hide,
  delete_size,
  size_edit,
  get_subcat_from_cat,
  get_subcat,
  addattribute,
  attribute_delete,
  attribute_edit,
  addsubattribute,
  subattribute_delete,
  subattribute_edit,
  get_subattr_from_cat,
  get_subattr,
  add,
  viewcatalog,
  add_attr,
  catalog_delete,
  gcatalog,
  gaddcategory,
  gsubcategory,
  catalog_edit,
  gcatalog_edit,
  login,
  get_data,
  import_data,
  update_data,
  demo
} = require("../controller/admin");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image_file[]") {
      cb(null, "public/imgs/catalog/");
    } else if (file.fieldname === "subimage_file1[]") {


      const filePath = `public/imgs/subimage/${file.originalname}`;
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          cb(null, "public/imgs/subimage/");
        } else {
          cb(null, "public/imgs/trash/");
        }
      });
    }
    else if (file.fieldname === "image_file_color1[]") {
      cb(null, "public/imgs/attr_images/");
    }
    else if (file.fieldname === "image_file_color2[]") {
      cb(null, "public/imgs/attr_images/");
    }
    else if (file.fieldname === "image_file_color3[]") {
      cb(null, "public/imgs/attr_images/");
    }
    else if (file.fieldname === "image_file_color4[]") {
      cb(null, "public/imgs/attr_images/");
    }
    else if (file.fieldname === "image_file_color5[]") {
      cb(null, "public/imgs/attr_images/");
    }
    else {
      const filePath = `public/imgs/attr_subimages/${file.originalname}`;
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          cb(null, "public/imgs/attr_subimages/");
        } else {
          cb(null, "public/imgs/trash/");
        }
      });
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const storages = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "cat_image") {
      cb(null, "public/imgs/category/");
    } else {
      cb(null, "public/imgs/subcategory/");
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploads = multer({
  storage: storages,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  }
});

router.get("/", index);
router.get("/add-category", gaddcategory);
router.post("/add-category", uploads.single("cat_image"), addcategory);
router.get("/sub-category", gsubcategory);
router.post("/sub-category", uploads.single("sub_image"), subcategory);
router.use("/add-fabric", addfabric);
router.use("/add-brand", addbrand);
router.use("/add-size", addsize);
router.get("/catalog", gcatalog);
router.post("/catalog", upload.any(), catalog);
router.post("/category_delete", category_delete);
router.post("/subcategory_delete", delete_subcategory);
router.use("/category_edit", uploads.single("cat_image"), category_edit);
router.use("/subcategory_edit", uploads.single("sub_image"), subcategory_edit);
router.use("/fabric_edit", upload.any(), fabric_edit);
router.use("/fabric_hide", fabric_hide);
router.use("/brand_edit", upload.any(), brand_edit);
router.use("/brand_hide", brand_hide);
router.use("/size_hide", size_hide);
router.use("/size_edit", upload.any(), size_edit);
router.use("/size_delete", delete_size);
router.use("/get_subcat_from_cat", get_subcat_from_cat);
router.use("/get_subcat", get_subcat);
router.use("/add-attribute", upload.any(), addattribute);
router.post("/attribute_delete", attribute_delete);
router.use("/attribute_edit", upload.any(), attribute_edit);
router.use("/add-subattribute", upload.any(), addsubattribute);
router.post("/subattribute_delete", subattribute_delete);
router.use("/subattribute_edit", upload.any(), subattribute_edit);
router.use("/get_subattr_from_cat", get_subattr_from_cat);
router.use("/get_subattr", get_subattr);
router.use("/add", add);
router.use("/view-catalog", viewcatalog);
router.post("/catalog_delete", catalog_delete);
router.get("/catalog_edit", gcatalog_edit);
router.post("/get_data", get_data);
const excel = multer({ dest: 'public/upload/' });
router.post("/import", excel.any(), import_data);
router.post("/update", excel.any(), update_data);
router.post("/catalog_edit", upload.any(), catalog_edit);

const storage12 = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "addimage[]") {
      cb(null, "public/imgs/attr_images/");
    } else if (file.fieldname === "addsubimage[]") {
      const filePath = `public/imgs/attr_subimages/${file.originalname}`;
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          cb(null, "public/imgs/attr_subimages/");
        } else {
          cb(null, "public/imgs/trash/");
        }
      });
    }

  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload12 = multer({
  storage: storage12,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  }
});

router.post("/add_attr", upload12.fields([
  {
    name: "product_attributea",
    maxCount: 1
  }, {
    name: "product_subattribute",
    maxCount: 1
  }, {
    name: "color",
    maxCount: 1
  }, {
    name: "addimage[]",
    maxCount: 10
  }, {
    name: "addsubimage[]",
    maxCount: 10
  }, {
    name: "addimagesize",
    maxCount: 10
  }
]), add_attr);

const storage123 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload123 = multer({ storage123 })
router.get('/demo', demo)
router.use('/login', login)
router.post("/demo", upload123.array('name[]'), async (req, res) => {
})

module.exports = router;



