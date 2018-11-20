function Observer(data, path) {
  this.data = data;
  this.walk(data, path);
}

var p = Observer.prototype;
// var arrayProto = Array.prototype;
// var arrayMethods = Object.create(arrayProto);
// ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(
//   function(item) {
//     Object.defineProperty(arrayMethods, item, {
//       value: function mutator() {
//         //緩存原生方法，之後調用
//         console.log("array被訪問");
//         var original = arrayProto[item];
//         var args = Array.from(arguments);
//         original.apply(this, args);
//         // console.log(this);
//       }
//     });
//   }
// );

//遍歷資料物件的結構
p.walk = function(obj, path) {
  var re = /^[0-9]+$/; //遍歷時判斷是否為陣列索引
  var value;
  for (var key in obj) {
    // 通過 hasOwnProperty 過濾掉一個對象本身擁有的屬性
    if (obj.hasOwnProperty(key)) {
      value = obj[key];
      //  遞迴調用，循環所有對象出來
      if (typeof value === "object") {
        if (Array.isArray(value)) {
          // var augment = value.__proto__ ? protoAugment : copyAugment;
          // augment(value, arrayMethods, key);
          observeArray(value, path + key);
        }
        if (!re.test(key)) {
          //若是陣列索引則不需定義denfineProperty
          new Observer(value, path + key);
        }
      }
      if (!re.test(key)) {
        this.DefineProperty(key, value, path + key);
      }
    }
  }
};

//定義資料物件結構的defineProperty
p.DefineProperty = function(key, value, path) {
  // 如果是array的話不定義defineProperty
  if (Array.isArray(this.data[key])) {
    console.log("array:" + key);
  } else {
    Object.defineProperty(this.data, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        console.log(path + "被訪問");
        return value;
      },
      set: function(newVal) {
        if (typeof value !== "object") {
          console.log(path + "被修改，新" + path + "=" + newVal);
        }
        if (newVal === value) {
          return;
        }
        value = newVal;
      }
    });
  }
};

function observeArray(items, path) {
  for (var i = 0, l = items.length; i < l; i++) {
    var name = path + "[" + i.toString() + "].";
    observe(items[i], name);
  }
}

//数据重复Observer
function observe(value, path) {
  if (typeof value != "object") return;
  var ob = new Observer(value, path);
  return ob;
}

var data = {
  Test: "測試",
  Details: [
    {
      PRDetailID: 1,
      QDetailID: 1,
      PRID: "A12334444",
      PRNum: "PR201808120001",
      QuoteNum: "QO201804260006",
      CategoryName: "辦公桌",
      ItemDescription: "Office",
      Sum: "100",
      UomName: "EA",
      Price: 300,
      CurrencyCode: "TWD",
      ForigenPrice: 30,
      PurchaseEmpName: "張三",
      PurchaseEmpNum: "17654",
      InvoiceEmpName: "李四",
      InvoiceEmpNum: "654321",
      PRDeliverys: [
        {
          PRDeliveryID: 1,
          Quantity: 1,
          ChargeDept: "301234",
          RcvDept: "304321"
        },
        {
          PRDeliveryID: 2,
          Quantity: 1,
          ChargeDept: "304321",
          RcvDept: "304321"
        }
      ]
    }
  ]
};

//辅助方法
function def(obj, key, val) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: true,
    writable: true,
    configurable: true
  });
}

// 兼容不支持__proto__的方法
//重新赋值Array的__proto__属性
function protoAugment(target, src) {
  target.__proto__ = src;
}
//不支持__proto__的直接修改相关属性方法
function copyAugment(target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

var app = new Observer(data, "");
// data.apg[2] = 111;
// data.details.push(5);
// data.apg[0].a = 10;
// console.log(data.apg);
