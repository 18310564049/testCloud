// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "username": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "姓名24",
    "label": "姓名24"
  },
  "address": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "地址",
    "label": "地址"
  },
  "gender": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "性别",
    "label": "性别"
  },
  "mobile": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      },
      {
        "pattern": "^\\+?[0-9-]{3,20}$"
      }
    ],
    "title": "电话",
    "label": "电话"
  },
  "email": {
    "rules": [
      {
        "format": "string"
      },
      {
        "format": "email"
      }
    ],
    "title": "邮箱",
    "label": "邮箱"
  },
  "comment": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "备注",
    "label": "备注"
  },
  "nation_china": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "名族",
    "label": "名族"
  }
}

const enumConverter = {}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
