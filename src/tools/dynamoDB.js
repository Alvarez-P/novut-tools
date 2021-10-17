/**
 * @typedef {object} DEFINED_COLUMNS
 * @property {String} [pk] - null
 * @property {String} [sk]- null
 * @property {String} [gsi1_pk] - INDEX_NAME
 *
 * @typedef {object} FILTERS
 * @property {String} [key] - value
 */

/**
 * @func buildExpressions
 * @description Construcción de expresiones para consultas en DynamoDB
 * @param {DEFINED_COLUMNS} definedColumns - Objeto con las columnas definidas de la tabla y el nombre de su índice
 * @returns {(filters: FILTERS) => object}
 */
const buildExpressions = (definedColumns = {}) => (filters) => {
  let KeyConditionExpression = '',
    UpdateExpression = 'set ',
    IndexName
  const ExpressionAttributeNames = {},
    ExpressionAttributeValues = {}

  Object.entries(filters).forEach(([key, value]) => {
    const attrName = `#${key}`,
      attrValue = `:${key}`
    ExpressionAttributeNames[attrName] = key
    ExpressionAttributeValues[attrValue] = value
    UpdateExpression += `${attrName} = ${attrValue}, `
    if (
      typeof value === 'boolean' ||
      typeof value === 'number' ||
      Object.keys(definedColumns).includes(key)
    )
      KeyConditionExpression += `${attrName} = ${attrValue} AND `
    else KeyConditionExpression += `begins_with(${attrName}, ${attrValue}) AND `
    IndexName = definedColumns[key]
  })
  return {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    KeyConditionExpression: KeyConditionExpression.slice(0, -5),
    UpdateExpression: UpdateExpression.slice(0, -2),
    IndexName: IndexName || null,
  }
}

module.exports = { buildExpressions }
