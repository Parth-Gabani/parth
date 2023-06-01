const session = require("express-session");
const { con } = require("../db/db");
const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const XLSX = require('xlsx');
const mime = require('mimetype');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const index = async (req, res) => {
  try {
    res.render("index2");
  } catch (error) {
    res.send(error);
  }
};

const addcategory = async (req, res) => {
  const {
    category,
    cname,
    slug,
    mtitle,
    mkeyword,
    mdescryption
  } = req.body;
  if (req.file) {
    var file = req.file.filename;
    const cat_image = file;
    var sql = "INSERT INTO admin (category , image,  cname ,slug,  mtitle , mkeyword , mdescryption) VALUES ('" + category + "','" + cat_image + "','" + cname + "','" + slug + "','" + mtitle + "','" + mkeyword + "','" + mdescryption + "')";
    con.query(sql, function (err, result) {
      if (err)
        throw err;
      if (result.affectedRows > 0) {
        res.redirect("add-category");
      }
    });
  }
}

const gaddcategory = async (req, res) => {
  con.query("SELECT * FROM admin", function (err, result, fields) {
    if (err)
      throw err;

    res.render("add-category", { data: result });
  });
};

const subcategory = async (req, res) => {
  const {
    subcategory,
    scname,
    slug,
    smtitle,
    smkeyword,
    smdescryption
  } = req.body;
  if (req.file) {
    var file = req.file.filename;

    const sub_image = file;

    var sql = "INSERT INTO subcategory (subcategory , image,  scname , slug, smtitle , smkeyword , smdescryption) VALUES ('" + subcategory + "','" + sub_image + "','" + scname + "','" + slug + "','" + smtitle + "','" + smkeyword + "','" + smdescryption + "')";
    con.query(sql, function (err, result) {
      if (err)
        throw err;
      if (result.affectedRows > 0) {
        res.redirect("sub-category");
      }
    });
  }
}

const gsubcategory = async (req, res) => {
  con.query("SELECT * FROM subcategory", function (err, result, fields) {
    if (err)
      throw err;

    con.query("SELECT * FROM admin", function (err, results, fields) {
      if (err)
        throw err;
      res.render("sub-category", {
        data: result,
        datas: results
      });
    });
  });
};

const addfabric = async (req, res) => {
  if (req.method == "POST") {
    const { fabric } = req.body;
    con.query("SELECT * FROM fabric where fabric='" + req.body.fabric + "'", function (err, result, fields) {
      if (err)
        throw err;

      if (result.length > 0) {
        res.end("<script>window.alert('Fabric  Already Exist');window.location.href = 'add-fabric ';</script>");
      } else {
        var sql = "INSERT INTO fabric (fabric ) VALUES ('" + fabric + "')";
        con.query(sql, function (err, result) {
          if (err)
            throw err;
          if (result.affectedRows > 0) {
            res.redirect("add-fabric");
          }
        });
      }
    });
  } else {
    con.query("SELECT * FROM fabric", function (err, result, fields) {
      if (err)
        throw err;

      res.render("add-fabric", { data: result });
    });
  }
};

const addbrand = async (req, res) => {
  if (req.method == "POST") {
    const { brand } = req.body;
    con.query("SELECT * FROM brand where brand='" + req.body.brand + "'", function (err, result, fields) {
      if (err)
        throw err;

      if (result.length > 0) {
        res.end("<script>window.alert('Brand  Already Exist');window.location.href = 'add-brand ';</script>");
      } else {
        var sql = "INSERT INTO brand (brand ) VALUES ('" + brand + "')";
        con.query(sql, function (err, result) {
          if (err)
            throw err;
          if (result.affectedRows > 0) {
            res.redirect("add-brand");
          }
        });
      }
    });
  } else {
    con.query("SELECT * FROM brand", function (err, result, fields) {
      if (err)
        throw err;

      res.render("add-brand", { data: result });
    });
  }
};

const addsize = async (req, res) => {
  if (req.method == "POST") {
    const { size } = req.body;
    con.query("SELECT * FROM size where size='" + req.body.size + "'", function (err, result, fields) {
      if (err)
        throw err;

      if (result.length > 0) {
        res.end("<script>window.alert('Size  Already Exist');window.location.href = 'add-size ';</script>");
      } else {
        var sql = "INSERT INTO size (size ) VALUES ('" + size + "')";
        con.query(sql, function (err, result) {
          if (err)
            throw err;
          if (result.affectedRows > 0) {
            res.redirect("add-size");
          }
        });
      }
    })
  }
  else {
    con.query("SELECT * FROM size", function (err, result, fields) {
      if (err)
        throw err;

      res.render("add-size", { data: result });
    });
  }
};

const catalog = async (req, res) => {
  const {
    id,
    selected_cat,
    selected_subcat,
    hsn,
    title,
    cname,
    cprice,
    cmrp,
    cpcs,
    cgst,
    cweight,
    cqut,
    length,
    ctype,
    moq,
    disable,
    dispatching
  } = req.body;

  const imageFiles = req.files.filter(file => file.fieldname.startsWith("image_file[]"));

  const file = imageFiles[0].filename;

  const image = file;

  const product = req.body.product_type1
    ? req.body.product_type1
    : "";
  const product_check = req.body.upcoming_checkbox
    ? req.body.upcoming_checkbox
    : "";
  const fabric = req.body.fabric
    ? req.body.fabric
    : "";
  const cstitch = req.body.cstitch
    ? req.body.cstitch
    : "";

  var sql = "INSERT INTO catalog (id,product,product_check,image,hsn, title, cname,fabric, cprice ,cmrp,cpcs,cgst,cweight,cstitch,cqut,length,ctype,moq,disable,dispatching) VALUES ('" + id + "','" + product + "','" + product_check + "','" + image + "','" + hsn + "','" + title + "','" + cname + "','" + fabric + "','" + cprice + "','" + cmrp + "','" + cpcs + "','" + cgst + "','" + cweight + "','" + cstitch + "','" + cqut + "','" + length + "','" + ctype + "','" + moq + "','" + disable + "','" + dispatching + "')";

  con.query(sql, function (err, result) {
    if (err)
      throw err;
    con.query("SHOW TABLE STATUS LIKE 'catalog'", function (err, catalog, fields) {
      if (err)
        throw err;
      const product_id = catalog[0].Auto_increment - 1;
      if (selected_cat && selected_cat.length > 0) {
        con.query("SELECT id FROM admin where id IN(" + selected_cat + ")", function (err, cat, fields) {
          if (err)
            throw err;
          if (cat.length > 0)
            for (i = 0; i < cat.length; i++) {
              var id = cat[i].id;
              var sql = "INSERT INTO relation (product_id,type_id,type) VALUES ('" + product_id + "','" + id + "','cat') ";
              con.query(sql, function (err, res) {
                if (err)
                  throw err;
              }
              );
            }
        });
      }
      if (selected_subcat && selected_subcat.length > 0) {
        con.query("SELECT id FROM subcategory where id IN(" + selected_subcat + ")", function (err, subcat, fields) {
          if (err)
            throw err;

          for (i = 0; i < subcat.length; i++) {
            var id = subcat[i].id;

            var sql = "INSERT INTO relation (product_id,type_id,type) VALUES ('" + product_id + "','" + id + "','subcat') ";
            con.query(sql, function (err, resul) {
              if (err)
                throw err;
            }
            );
          }
        });
      }
      const files = req.files.filter(file => file.fieldname.startsWith("subimage_file1[]"));

      if (!(files == "" || files == undefined)) {
        files.forEach(obj => {
          var sql = "INSERT INTO subimage (product_id,subimage) VALUES ('" + product_id + "','" + obj.filename + "') ";
          con.query(sql, function (err, resu) {
            if (err)
              throw err;
          }
          );
        });
      }
    });

    if (result.affectedRows > 0) {
      res.redirect("catalog");
    }
  });
};

const gcatalog = async (req, res) => {
  con.query("SELECT * FROM catalog ", function (err, result1, fields) {
    if (err)
      throw err;
    con.query("SELECT * FROM admin", function (err, result3, fields) {
      if (err)
        throw err;

      con.query("SELECT * FROM fabric", function (err, result4, fields) {
        if (err)
          throw err;

        con.query("SELECT * FROM attribute where aname != 'Color'", function (err, result6, fields) {
          if (err)
            throw err;
          con.query("SELECT * FROM subattribute where attr_id = 'Color'", function (err, result12, fields) {
            if (err)
              throw err;
            var product = []
            result1.forEach(element => {
              product.push(element.cname)
            });
            res.render("catalog", {
              data1: result1,
              data12: result12,
              data3: result3,
              data4: result4,
              data6: result6,
              product: product
            });
          });
        });
      });
    });
  });
};

const get_subcat_from_cat = async (req, res) => {
  cat_id = req.query.cat_id;
  if (cat_id !== "") {
    con.query("select * from subcategory where subcategory IN(" + cat_id + ")", function (err, result2, fields) {
      if (err)
        throw err;

      var content = "";
      for (i = 0; i < result2.length; i++) {
        var content = content + "<option value=" + result2[i].id + " >" + result2[i].scname + "</option>";
      }
      res.send(content);
    });
  } else {
    var content = "";
    var content = content + "<span>No results Found</span>";
    res.send(content);
  }
};

const get_subcat = async (req, res) => {
  cat_id = req.query.cat_id;
  subcat_id = req.body.subcat_id;
  if (cat_id !== "") {
    con.query("select * from subcategory where subcategory IN(" + cat_id + ")", function (err, result2, fields) {
      if (err)
        throw err;

      var content = "";
      for (i = 0; i < result2.length; i++) {
        var content = content + "<option value=" + result2[i].id + (
          result2[i].id == subcat_id
            ? " selected"
            : "") + " >" + result2[i].scname + "</option>";
      }
      res.send(content);
    });
  } else {
    var content = "";
    var content = content + "<span>No results Found</span>";
    res.send(content);
  }
}

const category_edit = async (req, res) => {
  if (req.method == "POST") {
    var id = req.query.id;
    const {
      category,
      cname,
      slug,
      cmobile,
      csort,
      mtitle,
      mkeyword,
      mdescryption
    } = req.body;
    if (req.file != undefined) {
      var image = req.file.filename;
      var sql = "UPDATE `admin` SET `id`='" + id + "',`category`='" + category + "',`image`='" + image + "',`cname`='" + cname + "',`slug`='" + slug + "',`mtitle`='" + mtitle + "',`mkeyword`='" + mkeyword + "',`mdescryption`='" + mdescryption + "' WHERE `id`='" + id + "'";
      con.query(sql, function (err, result) {
        if (err)
          throw err;
        if (result.affectedRows > 0) {
          res.redirect("add-category");
        }
      });
    }
    else {
      var sql = "UPDATE `admin` SET `id`='" + id + "',`category`='" + category + "',`cname`='" + cname + "',`slug`='" + slug + "',`mtitle`='" + mtitle + "',`mkeyword`='" + mkeyword + "',`mdescryption`='" + mdescryption + "' WHERE `id`='" + id + "'";
      con.query(sql, function (err, result) {
        if (err)
          throw err;
        if (result.affectedRows > 0) {
          res.redirect("add-category");
        }
      });
    }


  }
  else {
    const id = req.query.id;

    con.query("SELECT * FROM admin WHERE id = '" + id + "'", function (err, result, fields) {
      if (err)
        throw err;

      res.render("category_edit", { data: result[0] });
    });
  }
};

const subcategory_edit = async (req, res) => {
  if (req.method == "POST") {
    var id = req.query.id;
    const {
      scname,
      slug,
      smtitle,
      smkeyword,
      smdescryption
    } = req.body;
    if (req.file != undefined) {
      var image = req.file.filename;
      var sql = "UPDATE `subcategory` SET `id`='" + id + "',`image`='" + image + "',`scname`='" + scname + "',`slug`='" + slug + "',`smtitle`='" + smtitle + "',`smkeyword`='" + smkeyword + "',`smdescryption`='" + smdescryption + "' WHERE `id`='" + id + "'";
      con.query(sql, function (err, result) {
        if (err)
          throw err;
        if (result.affectedRows > 0) {
          res.redirect("sub-category");
        }
      });
    }
    else {
      var sql = "UPDATE `subcategory` SET `id`='" + id + "',`scname`='" + scname + "',`slug`='" + slug + "',`smtitle`='" + smtitle + "',`smkeyword`='" + smkeyword + "',`smdescryption`='" + smdescryption + "' WHERE `id`='" + id + "'";
      con.query(sql, function (err, result) {
        if (err)
          throw err;
        if (result.affectedRows > 0) {
          res.redirect("sub-category");
        }
      });
    }


  }
  else {
    const id = req.query.id;

    con.query("SELECT * FROM subcategory WHERE id = '" + id + "'", function (err, result, fields) {
      if (err)
        throw err;

      res.render("subcategory_edit", { data: result[0] });
    });
  }
};

const fabric_edit = async (req, res) => {
  if (req.method == "POST") {
    var id = req.query.id;
    const { fabric } = req.body;

    var sql = "UPDATE `fabric` SET `id`='" + id + "',`fabric`='" + fabric + "' WHERE `id`='" + id + "'";
    con.query(sql, function (err, result) {
      if (err)
        throw err;
      if (result.affectedRows > 0) {
        res.redirect("add-fabric");
      }
    });
  } else {
    const id = req.query.id;

    con.query("SELECT * FROM fabric WHERE id = '" + id + "'", function (err, result, fields) {
      if (err)
        throw err;

      res.render("fabric_edit", { data: result[0] });
    });
  }
};

const brand_edit = async (req, res) => {
  if (req.method == "POST") {
    var id = req.query.id;
    const { brand } = req.body;

    var sql = "UPDATE `brand` SET `id`='" + id + "',`brand`='" + brand + "' WHERE `id`='" + id + "'";
    con.query(sql, function (err, result) {
      if (err)
        throw err;
      if (result.affectedRows > 0) {
        res.redirect("add-brand");
      }
    });
  } else {
    const id = req.query.id;

    con.query("SELECT * FROM brand WHERE id = '" + id + "'", function (err, result, fields) {
      if (err)
        throw err;

      res.render("brand_edit", { data: result[0] });
    });
  }
};

const size_edit = async (req, res) => {
  if (req.method == "POST") {
    var id = req.query.id;
    const { size } = req.body;

    var sql = "UPDATE `size` SET `id`='" + id + "',`size`='" + size + "' WHERE `id`='" + id + "'";
    con.query(sql, function (err, result) {
      if (err)
        throw err;
      if (result.affectedRows > 0) {
        res.redirect("add-size");
      }
    });
  } else {
    const id = req.query.id;

    con.query("SELECT * FROM size WHERE id = '" + id + "'", function (err, result, fields) {
      if (err)
        throw err;

      res.render("size_edit", { data: result[0] });
    });
  }
};

const category_delete = async (req, res) => {
  var string = req.query.id;
  var array = [string];
  var id = array.join(",");
  var sql = "DELETE FROM admin WHERE id IN(" + id + ")";
  con.query(sql, function (err, result) {
    if (err)
      throw err;

    if (result.affectedRows > 0) {
      res.send("success");
    } else {
      res.send("error");
    }
  });
};

const delete_subcategory = async (req, res) => {
  var string = req.query.id;
  var array = [string];
  var id = array.join(",");
  var sql = "DELETE FROM subcategory WHERE id IN(" + id + ")";
  con.query(sql, function (err, result) {
    if (err)
      throw err;

    if (result.affectedRows > 0) {
      res.send("success");
    } else {
      res.send("error");
    }
  });
};

const fabric_hide = async (req, res) => {
  const id = req.query.id;

  con.query("SELECT * FROM fabric WHERE id = '" + id + "'", function (err, result, fields) {
    if (err)
      throw err;
    var hide = result[0].hidden;

    if (hide === "0") {
      hide = "1";
    } else if (hide === "1") {
      hide = "0";
    }
    var sql = "UPDATE `fabric` SET hidden='" + hide + "' WHERE `id`='" + id + "'";
    con.query(sql, function (err, result) {
      if (err)
        throw err;

      if (result.affectedRows > 0) {
        res.send("success");
      }
    });
  });
};

const brand_hide = async (req, res) => {
  const id = req.query.id;

  con.query("SELECT * FROM brand WHERE id = '" + id + "'", function (err, result, fields) {
    if (err)
      throw err;
    var hide = result[0].hidden;

    if (hide === "0") {
      hide = "1";
    } else if (hide === "1") {
      hide = "0";
    }
    var sql = "UPDATE `brand` SET hidden='" + hide + "' WHERE `id`='" + id + "'";
    con.query(sql, function (err, result) {
      if (err)
        throw err;

      if (result.affectedRows > 0) {
        res.send("success");
      }
    });
  });
};

const size_hide = async (req, res) => {
  const id = req.query.id;

  con.query("SELECT * FROM size WHERE id = '" + id + "'", function (err, result, fields) {
    if (err)
      throw err;
    var hide = result[0].hidden;

    if (hide === "0") {
      hide = "1";
    } else if (hide === "1") {
      hide = "0";
    }
    var sql = "UPDATE `size` SET hidden='" + hide + "' WHERE `id`='" + id + "'";
    con.query(sql, function (err, result) {
      if (err)
        throw err;

      if (result.affectedRows > 0) {
        res.send("success");
      }
    });
  });
};

const delete_size = async (req, res) => {
  var string = req.query.id;
  var array = [string];
  var id = array.join(",");
  var sql = "DELETE FROM size WHERE id IN(" + id + ")";
  con.query(sql, function (err, result) {
    if (err)
      throw err;

    if (result.affectedRows > 0) {
      res.send("success");
    } else {
      res.send("error");
    }
  });
};

const addattribute = async (req, res) => {
  if (req.method == "POST") {
    const { aname } = req.body;
    const attr_type = req.body.attr_type
      ? req.body.attr_type
      : "";
    con.query("SELECT * FROM attribute where aname='" + req.body.aname + "'", function (err, result, fields) {
      if (err)
        throw err;

      if (result.length > 0) {
        res.end("<script>window.alert('Attribute Name Already Exist');window.location.href = 'add-attribute ';</script>");
      } else {
        var sql = "INSERT INTO attribute (aname,attr_type) VALUES ('" + aname + "','" + attr_type + "')";
        con.query(sql, function (err, result) {
          if (err)
            throw err;
          if (result.affectedRows > 0) {
            res.redirect("add-attribute");
          }
        });
      }
    });
  } else {
    con.query("SELECT * FROM attribute", function (err, result, fields) {
      if (err)
        throw err;

      res.render("add-attribute", { data: result });
    });
  }
};

const attribute_delete = async (req, res) => {
  var string = req.query.id;
  var array = [string];
  var id = array.join(",");
  var sql = "DELETE FROM attribute WHERE attr_id IN(" + id + ")";
  con.query(sql, function (err, result) {
    if (err)
      throw err;

    if (result.affectedRows > 0) {
      res.send("success");
    } else {
      res.send("error");
    }
  });
};

const attribute_edit = async (req, res) => {
  if (req.method == "POST") {
    var attr_id = req.query.id;
    const { aname } = req.body;

    var sql = "UPDATE `attribute` SET `attr_id`='" + attr_id + "',`aname`='" + aname + "' WHERE `attr_id`='" + attr_id + "'";
    con.query(sql, function (err, result) {
      if (err)
        throw err;
      if (result.affectedRows > 0) {
        res.redirect("add-attribute");
      }
    });
  } else {
    const attr_id = req.query.id;

    con.query("SELECT * FROM attribute WHERE attr_id = '" + attr_id + "'", function (err, result, fields) {
      if (err)
        throw err;

      res.render("attribute_edit", { data: result[0] });
    });
  }
};

const addsubattribute = async (req, res) => {
  if (req.method == "POST") {
    const { subattribute, saname } = req.body;
    con.query("SELECT * FROM subattribute where saname='" + req.body.saname + "'", function (err, result, fields) {
      if (err)
        throw err;

      if (result.length > 0) {
        res.end("<script>window.alert('Subttribute Name Already Exist');window.location.href = 'add-subattribute ';</script>");
      } else {
        var sql = "INSERT INTO subattribute (attr_id,saname) VALUES ('" + subattribute + "','" + saname + "')";
        con.query(sql, function (err, result) {
          if (err)
            throw err;
          if (result.affectedRows > 0) {
            res.redirect("add-subattribute");
          }
        });
      }
    });
  } else {
    con.query("SELECT * FROM attribute", function (err, result, fields) {
      if (err)
        throw err;

      con.query("SELECT * FROM subattribute", function (err, results, fields) {
        if (err)
          throw err;

        res.render("add-subattribute", {
          data: result,
          datas: results
        });
      });
    });
  }
};

const subattribute_delete = async (req, res) => {
  var string = req.query.id;
  var array = [string];
  var id = array.join(",");
  var sql = "DELETE FROM subattribute WHERE subattr_id IN(" + id + ")";
  con.query(sql, function (err, result) {
    if (err)
      throw err;

    if (result.affectedRows > 0) {
      res.send("success");
    } else {
      res.send("error");
    }
  });
};

const subattribute_edit = async (req, res) => {
  if (req.method == "POST") {
    var subattr_id = req.query.id;
    const { subattribute, saname } = req.body;

    var sql = "UPDATE `subattribute` SET `subattr_id`='" + subattr_id + "',`attr_id`='" + subattribute + "',`saname`='" + saname + "' WHERE `subattr_id`='" + subattr_id + "'";
    con.query(sql, function (err, result) {
      if (err)
        throw err;
      if (result.affectedRows > 0) {
        res.redirect("add-subattribute");
      }
    });
  } else {
    const subattr_id = req.query.id;

    con.query("SELECT * FROM subattribute WHERE subattr_id = '" + subattr_id + "'", function (err, result, fields) {
      if (err)
        throw err;
      con.query("SELECT * FROM attribute", function (err, results, fields) {
        if (err)
          throw err;
        res.render("subattribute_edit", {
          data: result,
          datas: results
        });
      });
    });
  }
};

const get_subattr_from_cat = async (req, res) => {
  cat_id = req.query.cat_id;

  con.query("select * from subattribute where attr_id ='" + cat_id + "';", function (err, result2, fields) {
    if (err)
      throw err;
    var content = "";
    for (i = 0; i < result2.length; i++) {
      var content = content + "<option value=" + result2[i].saname + " >" + result2[i].saname + "</option>";
    }
    res.send(content);
  });
};

const get_subattr = async (req, res) => {
  cat_id = req.query.cat_id;
  subcat_id = req.body.subcat_id;

  con.query("select * from subattribute where attr_id ='" + cat_id + "';", function (err, result2, fields) {
    if (err)
      throw err;
    var content = "";
    for (i = 0; i < result2.length; i++) {
      var content = content + "<option value=" + result2[i].saname + (
        result2[i].id == subcat_id
          ? " selected"
          : "") + " >" + result2[i].saname + "</option>";
    }
    res.send(content);
  });
};

const add = async (req, res) => {
  txt = req.query.txt;

  attr_id = req.query.attr_id;

  var sql = "INSERT INTO subattribute (attr_id,saname) VALUES ('" + attr_id + "','" + txt + "')";
  con.query(sql, function (err, result) {
    if (err)
      throw err;
    if (result.affectedRows > 0) {
      res.send("success");
    }
  });
};

const add_attr = async (req, res) => {
  var productAttributea = req.body.product_attributea;
  var a = req.body.selectedValues;
  if (a) {
    var product_subattribute = a.join(',')
  }
  var addImage = req.files["addimage[]"];

  var addSubimage = req.files["addsubimage[]"];
  var color = req.body.color;
  var add = req.body.addimagesize;
  if (productAttributea && productAttributea.length > 0 && addImage == undefined) {
    const catalog = await querys("SHOW TABLE STATUS LIKE 'catalog'")
    const product_id = catalog[0].Auto_increment;
    var resul = await querys("INSERT INTO custom_attr (product_id,attr_name,attr_value) VALUES  ('" + product_id + "','" + productAttributea[0] + "','" + product_subattribute + "') ");
    res.send("ok");
  }
  else if (addImage.length > 0 && !productAttributea) {
    const catalog = await querys("SHOW TABLE STATUS LIKE 'catalog'")
    const product_id = catalog[0].Auto_increment;


    var color_relation_id = 0
    for (let i = 0; i < color.length; i++) {
      var result = await querys("INSERT INTO custom_attr_image (product_id,subattr_name,image) VALUES  ('" + product_id + "','" + color[i] + "','" + addImage[i].filename + "') ");
      color_relation_id = result.insertId
    }
    var a = 0;
    for (i = 0; i < add.length; i++) {
      for (j = 0; j < add[i]; j++) {
        var resul = await querys("INSERT INTO custom_attr_subimage (product_id,subattr_name,subimage,color_relation_id) VALUES  ('" + product_id + "','" + color[i] + "','" + addSubimage[a].filename + "','" + color_relation_id + "') ");

        a = a + 1;
      }
    }
    res.send("ok");
  }
  else if (productAttributea && productAttributea.length > 0 && addImage.length > 0) {
    const catalog = await querys("SHOW TABLE STATUS LIKE 'catalog'")
    const product_id = catalog[0].Auto_increment;

    var resul = await querys("INSERT INTO custom_attr (product_id,attr_name,attr_value) VALUES  ('" + product_id + "','" + productAttributea[0] + "','" + product_subattribute + "') ");

    var color_relation_id = 0
    for (let i = 0; i < color.length; i++) {
      var result = await querys("INSERT INTO custom_attr_image (product_id,subattr_name,image) VALUES  ('" + product_id + "','" + color[i] + "','" + addImage[i].filename + "') ");
      color_relation_id = result.insertId
    }
    var a = 0;
    for (i = 0; i < add.length; i++) {
      for (j = 0; j < add[i]; j++) {
        var resul = await querys("INSERT INTO custom_attr_subimage (product_id,subattr_name,subimage,color_relation_id) VALUES  ('" + product_id + "','" + color[i] + "','" + addSubimage[a].filename + "','" + color_relation_id + "') ");

        a = a + 1;
      }
    }
    res.send("ok");

  }
};

const viewcatalog = async (req, res) => {

  con.query("SELECT * FROM catalog ORDER BY `catalog`.`id` DESC", (err, products, fields) => {
    if (err)
      throw err;
    if (products == "") {
      res.render("view-catalog", { datas: products });
    } else {
      let productsWithData = [];

      products.forEach(product => {
        let productWithData = {
          id: product.id,
          title: product.title,
          cname: product.cname,
          image: product.image,
          cpcs: product.cpcs,
          cprice: product.cprice,
          disable: product.disable,
          dispatching: product.dispatching,
          categories: [],
          subcategories: []
        };
        con.query(`SELECT admin.cname
           FROM relation
           INNER JOIN admin ON relation.type_id = admin.id
           WHERE relation.product_id = '${product.id}' AND relation.type = 'cat'`, (error1, results1, fields1) => {
          if (error1)
            throw error1;

          results1.forEach(category => {
            productWithData.categories.push(category.cname);
          });

          con.query(`SELECT subcategory.scname
               FROM relation
               INNER JOIN subcategory ON relation.type_id = subcategory.id
               WHERE relation.product_id = '${product.id}' AND relation.type = 'subcat'`, (error2, results2, fields2) => {
            if (error2)
              throw error2;

            results2.forEach(subcategory => {
              productWithData.subcategories.push(subcategory.scname);
            });

            productsWithData.push(productWithData);

            if (productsWithData.length === products.length) {
              res.render("view-catalog", { datas: productsWithData });
            }
          });
        });
      });
    }
  });
};

const catalog_delete = async (req, res) => {
  var string = req.query.id;
  var array = [string];
  var id = array.join(",");
  await querys("DELETE FROM catalog WHERE id IN(" + id + ")");
  await querys("DELETE FROM custom_attr WHERE product_id IN(" + id + ")");
  await querys("DELETE FROM custom_attr_image WHERE product_id IN(" + id + ")");
  await querys("DELETE FROM custom_attr_subimage WHERE product_id IN(" + id + ")");
  await querys("DELETE FROM relation WHERE product_id IN(" + id + ")");
  await querys("DELETE FROM subimage WHERE product_id IN(" + id + ")");



  res.send("success");


};

const querys = (sql) => {
  return new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const catalog_edit = async (req, res) => {
  const id = req.query.id;
  const {
    selected_cat,
    selected_subcat,
    hsn,
    title,
    cname,
    cprice,
    cmrp,
    cpcs,
    cgst,
    cweight,
    cqut,
    length,
    ctype,
    moq,
    disable,
    dispatching
  } = req.body;
  const imageFiles = req.files.filter(file => file.fieldname.startsWith("image_file[]"));

  if (req.files && imageFiles && imageFiles.length > 0) {
    const product = req.body.product_type1
      ? req.body.product_type1
      : "";
    const product_check = req.body.upcoming_checkbox
      ? req.body.upcoming_checkbox
      : "";
    const fabric = req.body.fabric
      ? req.body.fabric
      : "";
    const cstitch = req.body.cstitch
      ? req.body.cstitch
      : "";
    var file = imageFiles[0].filename;

    const image = file;
    var sql = await querys("UPDATE catalog SET product='" + product + "',product_check='" + product_check + "',image='" + image + "',hsn='" + hsn + "',title='" + title + "',cname='" + cname + "',fabric='" + fabric + "',cprice='" + cprice + "',cmrp='" + cmrp + "',cpcs='" + cpcs + "',cgst='" + cgst + "',cweight='" + cweight + "',cstitch='" + cstitch + "',cqut='" + cqut + "',length='" + length + "',ctype='" + ctype + "',moq='" + moq + "',disable='" + disable + "',dispatching='" + dispatching + "' WHERE id = '" + id + "'")


  } else {
    const product = req.body.product_type1
      ? req.body.product_type1
      : "";
    const product_check = req.body.upcoming_checkbox
      ? req.body.upcoming_checkbox
      : "";
    const fabric = req.body.fabric
      ? req.body.fabric
      : "";
    const cstitch = req.body.cstitch
      ? req.body.cstitch
      : "";

    var sql = await querys("UPDATE catalog SET product='" + product + "',product_check='" + product_check + "',hsn='" + hsn + "',title='" + title + "',cname='" + cname + "',fabric='" + fabric + "',cprice='" + cprice + "',cmrp='" + cmrp + "',cpcs='" + cpcs + "',cgst='" + cgst + "',cweight='" + cweight + "',cstitch='" + cstitch + "',cqut='" + cqut + "',length='" + length + "',ctype='" + ctype + "',moq='" + moq + "',disable='" + disable + "',dispatching='" + dispatching + "' WHERE id = '" + id + "'");


  }
  if (sql) {
    const cat = await querys("SELECT id FROM admin where id IN(" + selected_cat + ")")
    await querys("DELETE FROM `relation` WHERE product_id = '" + id + "' AND  type = 'cat'")
    for (i = 0; i < cat.length; i++) {
      var cat_id = cat[i].id;
      await querys("INSERT INTO relation (product_id,type_id,type) VALUES ('" + id + "','" + cat_id + "','cat') ");

    }
    const subcat = await querys("SELECT id FROM subcategory where id IN(" + selected_subcat + ")")

    await querys("DELETE FROM `relation` WHERE product_id = '" + id + "' AND  type = 'subcat'")

    for (i = 0; i < subcat.length; i++) {
      var sub_id = subcat[i].id;

      await querys("INSERT INTO relation (product_id,type_id,type) VALUES ('" + id + "','" + sub_id + "','subcat') ");

    }


    let subimage1 = [];
    subimage1 = req.files.filter(file => file.fieldname === "subimage_file1[]");
    let sub_id_1 = [];
    let sub_array = [];
    let sub_id_2 = [];
    const fetch_sub = await querys(`SELECT * FROM subimage WHERE product_id='${id}'`)
    fetch_sub.forEach((sub_data) => {
      const sub_array1 = sub_data.subimage;
      sub_array.push(sub_array1);
      sub_id_2.push(sub_data.id);
    });

    for (let k = 0; k < subimage1.length; k++) {
      if (subimage1[k] != null) {
        const image = subimage1[k];
        const image1 = subimage1[k];
        if (sub_array.includes(image1.originalname)) {
          const index = sub_array.indexOf(image1.originalname);
          const subimage_id = sub_id_2[index];
          sub_id_1.push(subimage_id);
        } else {
          const sql2 = await querys(`INSERT INTO subimage(product_id,subimage) VALUES('${id}', '${image1.filename}')`);
        }
      }
    }

    let output = [];
    if (sub_id_1.length > 0) {
      output = sub_id_2.filter((item) => !sub_id_1.includes(item)).concat(sub_id_1.filter((item) => !sub_id_2.includes(item)));
      output = output.join(',');
    } else {
      output = sub_id_2.join(',');
    }
    if (output.length > 0) {
      const sql_sub = await querys(`DELETE FROM subimage WHERE product_id='${id}' AND  id IN(${output})`);

    }

    var old_color_id_array = req.body.old_color_id_array1
    var subattr_name = req.body.selected_color1
    var total_color_array = req.body.total_color_array1
    var old_array = []

    var new_array = []
    if (subattr_name != undefined) {
      for (i = 0; i < subattr_name.length; i++) {
        var selected_color_1 = subattr_name[i]
        var sumimg_value = total_color_array[i];
        var old_color_id_array_1 = old_color_id_array[i];
        const image_file_color_1 = req.files.filter(file => file.fieldname === "image_file_color" + sumimg_value + '[]');
        var subimmgg = "";
        if (image_file_color_1.length > 0) {
          subimmgg = ",image='" + image_file_color_1[0].filename + "'";
        }
        var color_od_db = "`subattr_name`='" + selected_color_1 + "' and `product_id`='" + id + "'";
        var color_reation_od_db = "`subattr_name`='" + selected_color_1 + "' and `product_id`='" + id + "'";
        if (old_color_id_array_1) {
          old_array.push(old_color_id_array_1);
          color_od_db = "id='" + old_color_id_array_1 + "'";
          color_reation_od_db = "color_relation_id='" + old_color_id_array_1 + "'";
        }
        const cat = await querys("select * from `custom_attr_image` where " + color_od_db);
        if (cat.length > 0) {
          var last_id1 = cat[0].id
          await querys("update `custom_attr_image` SET  `subattr_name`='" + selected_color_1 + "' " + subimmgg + " where " + color_od_db + "");
          await querys("update `custom_attr_subimage` SET `subattr_name`='" + selected_color_1 + "' where " + color_reation_od_db + "");


        } else {
          const result = await querys("insert into `custom_attr_image` set `subattr_name`='" + selected_color_1 + "',`product_id`='" + id + "' " + subimmgg + "");
          last_id1 = result.insertId
          old_array.push(last_id1);

        }
        var sub_array_color = []
        var sub_id_color_2 = []
        var sub_id__color_1 = []
        const fetch_sub123 = await querys("select * from custom_attr_subimage where " + color_reation_od_db + "");
        for (j = 0; j < fetch_sub123.length; j++) {
          var sub_array2 = fetch_sub123[j].subimage
          sub_array_color.push(sub_array2)
          sub_id_color_2.push(fetch_sub123[j].id)
        }
        var variation_subImages = req.files.filter(file => file.fieldname === 'subimage_file_color1_' + sumimg_value + '[]')
        for (x = 0; x < variation_subImages.length; x++) {

          var image2 = variation_subImages[x];
          if (sub_array_color.includes(image2.originalname)) {
            const index = sub_array_color.indexOf(image2.originalname);
            var subimage_id = sub_id_color_2[index];
            sub_id__color_1.push(subimage_id);
          }
          else {
            if (image2 !== undefined && image2 !== null && image2 !== '') {

              const images_sql = await querys("insert into custom_attr_subimage(product_id,subattr_name,subimage,color_relation_id)values('" + id + "','" + selected_color_1 + "','" + image2.filename + "','" + last_id1 + "')");
            }

          }

        }
        let output_color = [];

        if (sub_id__color_1.length > 0) {
          output_color = [...new Set([...sub_id_color_2].filter(x => !sub_id__color_1.includes(x)).concat([...sub_id__color_1].filter(x => !sub_id_color_2.includes(x))))];
          output_color = output_color.join(',');
        }
        else {
          output_color = sub_id_color_2.join(',');
        }

        if (output_color != "") {
          const sql_sub = await querys("delete from `custom_attr_subimage` where `product_id`='" + id + "'  and id IN(" + output_color + ")")
        }
      }
    }

    if (old_array.length > 0) {
      let output_de = old_array.join(',');
      await querys("delete from `custom_attr_image` where `product_id`='" + id + "'  and id NOT IN(" + output_de + ")");
      await querys("delete from `custom_attr_subimage` where `product_id`='" + id + "'  and color_relation_id NOT IN(" + output_de + ")");
    } else {
      await querys("delete from `custom_attr_image` where `product_id`='" + id + "' ");
      await querys("delete from `custom_attr_subimage` where `product_id`='" + id + "'");
    }
    const le = await querys('select * from attribute where aname!="Color"')
    for (let l = 1; l <= le.length; l++) {
      let a = `product_attributea${l}`
      let b = `product_subattribute${l}`

      if (req.body[a] || req.body[b]) {
        await querys("delete from `custom_attr` where `product_id`='" + id + "' and attr_name = '" + req.body[a] + "' and attr_value = '" + req.body[b] + "' ");
        await querys("INSERT INTO `custom_attr` SET `product_id`='" + id + "', `attr_name`='" + req.body[a] + "' , attr_value = '" + req.body[b] + "'  ")
      }

    }

    res.redirect("view-catalog");

  }
}

const gcatalog_edit = async (req, res) => {
  const id = req.query.id;
  const result1 = await querys("SELECT * FROM catalog  Where id != '" + id + "'  ")

  const data = await querys("select * from catalog Where id = '" + id + "' ")

  const subimages = await querys("select * from subimage Where product_id = '" + id + "' ")

  var subimage = subimages.map(cat_id => cat_id.subimage);

  const cat = await querys("select type_id from relation Where product_id IN( " + id + ") AND type = 'cat' ")


  var cat_id = cat.map(cat_id => cat_id.type_id);

  const data1 = await querys("select * from admin  ")


  const subcat = await querys("select type_id from relation Where product_id IN( " + id + ") AND type = 'subcat' ")

  var subcat_id = subcat.map(cat_id => cat_id.type_id);
  var data2 = []
  if (cat_id.length > 0) {
    data2 = await querys("select * from subcategory WHERE subcategory IN(" + cat_id + ") ")
  } else {
    data2 = []
  }

  const result4 = await querys("SELECT * FROM fabric")

  const result66 = await querys("SELECT * FROM attribute where aname != 'Color' ")
  var result6 = result66.map(a => a.aname);
  const subattributes = await querys("SELECT * FROM subattribute where attr_id != 'Color' ")
  var subattribute = subattributes.map(a => a.saname);
  const result7 = await querys("SELECT * FROM custom_attr WHERE product_id='" + id + "'")
  var attr_name = result7.map(attr_name => attr_name.attr_name);
  var attr_value = result7.map(attr_name => attr_name.attr_value)

  const result12 = await querys("SELECT * FROM subattribute where attr_id = 'Color'")

  const result77 = await querys("SELECT * FROM custom_attr WHERE product_id='" + id + "' AND attr_name = 'Color'")

  var product = []
  result1.forEach(element => {
    product.push(element.cname)
  });
  async function getCustomAttributes(id) {
    return new Promise(async function (resolve, reject) {
      const cus_image = await querys("select * from custom_attr_image Where product_id = '" + id + "' ");

      var content = [];

      async function querySubimage(i) {
        if (i >= cus_image.length) {
          resolve(content);
          return;
        }

        var content1 = {};
        content1['color_id'] = cus_image[i].id;
        content1['color'] = cus_image[i].subattr_name;
        content1['image'] = cus_image[i].image;

        const cus_subimage = await querys("select * from custom_attr_subimage Where product_id = '" + id + "' AND subattr_name ='" + cus_image[i].subattr_name + "'");

        var content2 = {};

        for (j = 0; j < cus_subimage.length; j++) {
          content2['image' + (j + 1)] = cus_subimage[j].subimage;
        }

        content1['subimages'] = content2;
        content.push(content1);

        await querySubimage(i + 1);
      }

      await querySubimage(0);
    });
  }

  getCustomAttributes(id)
    .then(function (content) {

      res.render("catalog_edit", {
        data: data,
        subimage: subimage,
        cat_id: cat_id,
        data1: data1,
        subcat_id: subcat_id,
        data2: data2,
        data4: result4,
        data6: result6,
        subattribute: subattribute,
        data7: result7,
        attr_name: attr_name,
        attr_value: attr_value,
        data12: result12,
        data77: result77,
        content: content,
        product: product,
      })
    })
    .catch(function (err) {
      console.error(err);
    });
};

const demo = async (req, res) => {
  if (req.method == 'POST') {
  }
  else {
    res.render('demo');

  }
}
const login = async (req, res) => {
  if (req.method == 'POST') {
  }
  else {
    res.render('login');

  }
}

const get_data_for_ids = async (id) => {
  const fetch_sub123 = await querys("select * from catalog where id IN (" + id + ")");
  const fetch = await querys("select type_id from relation where product_id IN (" + id + ") and type='cat'");
  const typeId = fetch.map(row => row.type_id);
  const fetchs = await querys("select type_id  from relation where product_id IN (" + id + ") and type='subcat'");
  const typeIds = fetchs.map(row => row.type_id);
  const cat = await querys("select cname from admin where id IN (" + typeId + ")");
  const subcat = await querys("select scname from subcategory where id IN (" + typeIds + ")");
  const subimage = await querys("select subimage from subimage where product_id IN (" + id + ")");
  const subimages = subimage.map(row => row.subimage);
  const attr = await querys("select * from custom_attr where product_id IN (" + id + ")");
  const attr_name = attr.map(row => row.attr_name);
  const attr_value = attr.map(row => row.attr_value);
  const custom_attr = await querys("select * from custom_attr_image where product_id IN (" + id + ")");
  const subattr_name = custom_attr.map(row => row.subattr_name);
  const custom_attr_image = custom_attr.map(row => row.image);
  const color_relation_id = custom_attr.map(row => row.id)
  const color = color_relation_id.join(',')
  var custom_attr_subimage = []
  var color_id = []
  for (let index = 0; index < color_relation_id.length; index++) {
    const custom = await querys("select * from custom_attr_subimage where product_id IN (" + id + ") and color_relation_id='" + color_relation_id[index] + "'");
    const custom_attr = custom.map(row => row.subimage);
    custom_attr_subimage.push(custom_attr)
    const color = custom.map(row => row.color_relation_id);
    color_id.push(color)
  }
  if (fetch_sub123.length > 0) {
    const cnames = { category: cat.map(c => c.cname) };
    const scnames = { subcategory: subcat.map(c => c.scname) };
    const subimagess = { subimage: subimages };
    const attr_names = { attr_name: attr_name };
    const attr_values = { attr_value: attr_value };
    const subattr_names = { subattr_name: subattr_name };
    const custom_attr_images = { custom_attr_image: custom_attr_image };
    const custom_attr_subimages = { custom_attr_subimage: custom_attr_subimage };
    const data = { ...fetch_sub123[0], ...cnames, ...scnames, ...subimagess, ...attr_names, ...attr_values, ...subattr_names, ...custom_attr_images, ...custom_attr_subimages };
    data.category = data.category.join(';');
    data.subcategory = data.subcategory.join(';');
    data.subimage = data.subimage.join(';');
    data.attr_name = data.attr_name.join(';');
    data.attr_value = data.attr_value.join(';');
    data.subattr_name = data.subattr_name.join(';');
    data.custom_attr_image = data.custom_attr_image.join(';');
    data.custom_attr_subimage = data.custom_attr_subimage.join(';');
    return data;
  }
}

const get_data = async (req, res) => {
  const ids = req.query.id.split(',');
  const data = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const result = await get_data_for_ids(id);
    data.push(result);
  }
  res.json(data);
}


const import_data = async (req, res) => {
  const file = req.files;

  const fileType = mime.lookup(file[0].originalname);

  if (fileType !== 'application/vnd.ms-excel' && fileType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    res.status(400).send('Error: Invalid file format.');
    return;
  }
  const filePath = file[0].path;
  const fileContents = fs.readFileSync(filePath);

  const buffer = Buffer.from(fileContents);

  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_csv(worksheet, { header: 1 });
  const rows = data.split('\n');
  const first = rows[0].split(',');
  let errorMsg = '';
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].match(/(".*?"|[^,]+)/g)
      .map(item => item.replace(/(^"|"$)/g, ''));

    const cname = await querys("select cname from catalog")
    const cnames = cname.map(c => c.cname)
    const category = await querys("select cname from admin")
    const category_id = category.map(row => row.cname)
    const subcategory = await querys("select scname from subcategory")
    const subcategory_id = subcategory.map(row => row.scname)
    const attribute = await querys("select aname from attribute")
    const attributes = attribute.map(row => row.aname)
    const subattribute = await querys("select saname from subattribute")
    const subattributes = subattribute.map(row => row.saname)

    const cn = first.indexOf('cname')
    const c = first.indexOf('category');
    const s = first.indexOf('subcategory');
    const an = first.indexOf('attr_name');
    const av = first.indexOf('attr_value');
    const cns = row[cn]

    if (cnames.includes(cns)) {
      errorMsg += `Catalog Name Already Exists for Row ${i}<br>`;
    }

    if (first.includes('category')) {
      const cax = row[c].split(';')
      for (const value of cax) {
        if (!category_id.includes(value)) {
          errorMsg += `Please Enter Valid Category at Row ${i}<br>`;
        }
      }
    }
    if (first.includes('subcategory')) {
      const scax = row[s].split(';')
      for (const value of scax) {
        if (!subcategory_id.includes(value)) {
          errorMsg += `Please Enter Valid Subcategory at Row ${i}<br>`;
        }
      }
    }
    if (first.includes('attr_name')) {
      const anx = row[an].split(';')
      for (const value of anx) {
        if (!attributes.includes(value)) {
          errorMsg += `Please Enter Valid attr_name at Row ${i}<br>`;
        }
      }
    }
    if (first.includes('attr_value')) {
      const avx = row[av].split(';')
      for (const value of avx) {
        let a = value.split(',')
        for (let v = 0; v < a.length; v++) {
          if (!subattributes.includes(a[v])) {
            errorMsg += `Please Enter Valid attr_value at Row ${i}<br>`;
          }
        }
      }
    }

    if (errorMsg == '') {
      var feild = []
      for (let l = 0; l < first.length; l++) {
        if (first[l] == 'disable' || first[l] == 'dispatching') {
          row[l] = new Date(row[l]).toISOString();
        }
        if (first[l] == 'category' || first[l] == 'subcategory' || first[l] == 'subimage' || first[l] == 'attr_name' || first[l] == 'attr_value' || first[l] == 'subattr_name' || first[l] == 'custom_attr_subimage') {
          break;
        }
        feild.push(`${first[l]}="${row[l]}"`)
      }
      await querys(`insert into catalog set ${feild}`);

      if (first.includes('category')) {
        const c = first.indexOf('category');
        var cat_id = row[c].split(';');
        const catIds = cat_id.map(c => `'${c}'`).join(',');
        var cat = await querys(`SELECT id from admin where cname IN (${catIds})`);
        const typeIds = cat.map(row => row.id);
        const catalog = await querys("SHOW TABLE STATUS LIKE 'catalog'")
        const product_id = catalog[0].Auto_increment - 1;
        for (let j = 0; j < typeIds.length; j++) {
          await querys(`insert into relation (product_id,type_id,type) values (${product_id},'${typeIds[j]}', 'cat')`);
        }
      }

      if (first.includes('subcategory')) {
        const s = first.indexOf('subcategory');
        const subcat_id = row[s].split(';')
        const catIds = subcat_id.map(c => `'${c}'`).join(',');
        var subcat = await querys(`SELECT id from subcategory where scname IN (${catIds})`);
        const typeIds = subcat.map(row => row.id);
        const catalog = await querys("SHOW TABLE STATUS LIKE 'catalog'")
        const product_id = catalog[0].Auto_increment - 1;
        for (let j = 0; j < typeIds.length; j++) {
          await querys(`insert into relation (product_id,type_id,type) values (${product_id},'${typeIds[j]}', 'subcat')`);
        }
      }

      if (first.includes('subimage')) {
        const su = first.indexOf('subimage');
        const subimage = row[su].split(';')
        const catalog = await querys("SHOW TABLE STATUS LIKE 'catalog'")
        const product_id = catalog[0].Auto_increment - 1;
        for (let j = 0; j < subimage.length; j++) {
          await querys(`Insert into subimage (product_id,subimage) values ("${product_id}","${subimage[j]}")`)
        }
      }

      if (first.includes('attr_name') && first.includes('attr_value')) {
        const an = first.indexOf('attr_name');
        const attr_name = row[an].split(';')
        const av = first.indexOf('attr_value');
        const attr_value = row[av].split(';')
        const catalog = await querys("SHOW TABLE STATUS LIKE 'catalog'")
        const product_id = catalog[0].Auto_increment - 1;
        for (let j = 0; j < attr_value.length; j++) {
          await querys(`Insert into custom_attr (product_id,attr_name,attr_value) values ("${product_id}","${attr_name[j]}","${attr_value[j]}")`)
        }
      }

      if (first.includes('subattr_name') && first.includes('custom_attr_image')) {
        const an = first.indexOf('subattr_name');
        const subattr_name = row[an].split(';')
        const av = first.indexOf('custom_attr_image');
        const custom_attr_image = row[av].split(';')
        const catalog = await querys("SHOW TABLE STATUS LIKE 'catalog'")
        const product_id = catalog[0].Auto_increment - 1;
        for (let j = 0; j < subattr_name.length; j++) {
          await querys(`Insert into custom_attr_image (product_id,subattr_name,image) values ("${product_id}","${subattr_name[j]}","${custom_attr_image[j]}")`)
        }
      }

      if (first.includes('subattr_name') && first.includes('custom_attr_subimage')) {
        const an = first.indexOf('subattr_name');
        const subattr_name = row[an].split(';')
        const av = first.indexOf('custom_attr_subimage');
        const custom_attr_subimage = row[av].split(';')
        const catalog = await querys("SHOW TABLE STATUS LIKE 'catalog'")
        const product_id = catalog[0].Auto_increment - 1;
        for (let j = 0; j < subattr_name.length; j++) {
          if (custom_attr_subimage[j]) {
            let subimage = custom_attr_subimage[j].split(',');
            for (let l = 0; l < subimage.length; l++) {
              const color_relation_id = await querys(`select id from custom_attr_image where subattr_name='${subattr_name[j]}'`)
              await querys(`insert into custom_attr_subimage set product_id='${product_id}',subattr_name='${subattr_name[j]}',subimage='${subimage[l]}', color_relation_id='${color_relation_id[0].id}'`)
            }
          }
        }
      }

    }
  }
  if (errorMsg !== '') {
    res.send(errorMsg)
  } else {
    res.send('success')
  }
}

const update_data = async (req, res) => {
  const file = req.files;

  const fileType = mime.lookup(file[0].originalname);

  if (fileType !== 'application/vnd.ms-excel' && fileType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    res.status(400).send('Error: Invalid file format.');
    return;
  }
  const filePath = file[0].path;
  const fileContents = fs.readFileSync(filePath);

  const buffer = Buffer.from(fileContents);

  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_csv(worksheet, { header: 1 });
  const rows = data.split('\n');
  const first = rows[0].split(',');
  let errorMsg = '';
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].match(/(".*?"|[^,]+)/g)
      .map(item => item.replace(/(^"|"$)/g, ''));

    const cname = await querys("select cname from catalog")
    const cnames = cname.map(c => c.cname)
    const category = await querys("select cname from admin")
    const category_id = category.map(row => row.cname)
    const subcategory = await querys("select scname from subcategory")
    const subcategory_id = subcategory.map(row => row.scname)
    const attribute = await querys("select aname from attribute")
    const attributes = attribute.map(row => row.aname)
    const subattribute = await querys("select saname from subattribute")
    const subattributes = subattribute.map(row => row.saname)

    const cn = first.indexOf('cname')
    const c = first.indexOf('category');
    const s = first.indexOf('subcategory');
    const an = first.indexOf('attr_name');
    const av = first.indexOf('attr_value');
    const cns = row[cn]

    if (cnames.includes(cns)) {
      errorMsg += `Catalog Name Already Exists for Row ${i}<br>`;
    }
    if (first.includes('category')) {
      const cax = row[c].split(';')
      for (const value of cax) {
        if (!category_id.includes(value)) {
          errorMsg += `Please Enter Valid Category at Row ${i}<br>`;
        }
      }
    }
    if (first.includes('subcategory')) {
      const scax = row[s].split(';')
      for (const value of scax) {
        if (!subcategory_id.includes(value)) {
          errorMsg += `Please Enter Valid Subcategory at Row ${i}<br>`;
        }
      }
    }
    if (first.includes('attr_name')) {
      const anx = row[an].split(';')
      for (const value of anx) {
        if (!attributes.includes(value)) {
          errorMsg += `Please Enter Valid attr_name at Row ${i}<br>`;
        }
      }
    }
    if (first.includes('attr_value')) {
      const avx = row[av].split(';')
      for (const value of avx) {
        let a = value.split(',')
        for (let v = 0; v < a.length; v++) {
          if (!subattributes.includes(a[v])) {
            errorMsg += `Please Enter Valid attr_value at Row ${i}<br>`;
          }
        }
      }
    }

    if (errorMsg == '') {
      var feild = []
      for (let l = 0; l < first.length; l++) {
        if (first[l] == 'disable' || first[l] == 'dispatching') {
          row[l] = new Date(row[l]).toISOString();
        }
        if (first[l] == 'category' || first[l] == 'subcategory' || first[l] == 'subimage' || first[l] == 'attr_name' || first[l] == 'attr_value' || first[l] == 'subattr_name' || first[l] == 'custom_attr_subimage') {
          break;
        }
        feild.push(`${first[l]}="${row[l]}"`)
      }
      await querys(`update catalog set ${feild} where id=${row[0]}`);

      if (first.includes('category')) {
        const c = first.indexOf('category');
        var cat_id = row[c].split(';');
        const catIds = cat_id.map(c => `'${c}'`).join(',');
        var cat = await querys(`SELECT id from admin where cname IN (${catIds})`);
        const typeIds = cat.map(row => row.id);
        await querys(`delete from relation WHERE product_id='${row[0]}' and type='cat'`);
        for (let j = 0; j < typeIds.length; j++) {
          await querys(`insert into relation (product_id,type_id,type) values (${row[0]},'${typeIds[j]}', 'cat')`);
        }
      }

      if (first.includes('subcategory')) {
        const s = first.indexOf('subcategory');
        const subcat_id = row[s].split(';')
        const catIds = subcat_id.map(c => `'${c}'`).join(',');
        var subcat = await querys(`SELECT id from subcategory where scname IN (${catIds})`);
        const typeIds = subcat.map(row => row.id);
        await querys(`delete from relation WHERE product_id='${row[0]}' and type='subcat'`);
        for (let j = 0; j < typeIds.length; j++) {
          await querys(`insert into relation (product_id,type_id,type) values (${row[0]},'${typeIds[j]}', 'subcat')`);
        }
      }

      if (first.includes('subimage')) {
        const su = first.indexOf('subimage');
        const subimage = row[su].split(';')
        await querys(`delete from subimage WHERE product_id='${row[0]}'`);
        for (let j = 0; j < subimage.length; j++) {
          await querys(`Insert into subimage (product_id,subimage) values ("${row[0]}","${subimage[j]}")`)
        }
      }

      if (first.includes('attr_name') && first.includes('attr_value')) {
        const an = first.indexOf('attr_name');
        const attr_name = row[an].split(';')
        const av = first.indexOf('attr_value');
        const attr_value = row[av].split(';')
        for (let j = 0; j < attr_value.length; j++) {
          await querys(`delete from custom_attr WHERE product_id='${row[0]}' and attr_name="${attr_name[j]}"`);
          await querys(`Insert into custom_attr (product_id,attr_name,attr_value) values ("${row[0]}","${attr_name[j]}","${attr_value[j]}")`)
        }
      }

      if (first.includes('subattr_name') && first.includes('custom_attr_image')) {
        const an = first.indexOf('subattr_name');
        const subattr_name = row[an].split(';')
        const av = first.indexOf('custom_attr_image');
        const custom_attr_image = row[av].split(';')
        for (let j = 0; j < subattr_name.length; j++) {
          const result = await querys(`select * from custom_attr_image where product_id='${row[0]}' and subattr_name='${subattr_name[j]}' and image='${custom_attr_image[j]}'`)

          if (await result.length > 0) {
            await querys(`update custom_attr_image set product_id='${row[0]}',subattr_name='${subattr_name[j]}' and image='${custom_attr_image[j]}' where product_id='${result[0].id}'`)
          } else {
            await querys(`Insert into custom_attr_image (product_id,subattr_name,image) values ("${row[0]}","${subattr_name[j]}","${custom_attr_image[j]}")`)
          }
        }
      }

      if (first.includes('subattr_name') && first.includes('custom_attr_subimage')) {
        const an = first.indexOf('subattr_name');
        const subattr_name = row[an].split(';')
        const av = first.indexOf('custom_attr_subimage');
        const custom_attr_subimage = row[av].split(';')

        for (let j = 0; j < subattr_name.length; j++) {
          if (custom_attr_subimage[j]) {
            let subimage = custom_attr_subimage[j].split(',');
            await querys(`delete from custom_attr_subimage where product_id='${row[0]}' and subattr_name='${subattr_name[j]}'`)
            for (let l = 0; l < subimage.length; l++) {
              const color_relation_id = await querys(`select id from custom_attr_image where subattr_name='${subattr_name[j]}'`)
              await querys(`insert into custom_attr_subimage set product_id='${row[0]}',subattr_name='${subattr_name[j]}',subimage='${subimage[l]}', color_relation_id='${color_relation_id[0].id}'`)
            }
          }
        }
      }
    }
  }

  if (errorMsg !== '') {
    res.send(errorMsg)
  } else {
    res.send('success')
  }
}

module.exports = {
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
  size_edit,
  size_hide,
  delete_size,
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
  demo,
  login,
  get_data,
  import_data,
  update_data,
};
