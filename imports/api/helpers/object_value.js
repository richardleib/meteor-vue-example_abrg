/**
 * Get value from object property
 * @param {Object|Array} obj Object or Array
 * @param {String|Array} property Dot notation ('a.b') or array ( [ 'a', 'b' ] )
 * @param {*} [default_val=false] Returned if value is undefined
 * @example
 * object_value( { a: { b: "c" } }, 'a.b' ); // Returns: c
 * object_value( [ 'a', 2, { c: "d" } ], '3.c' ); // Returns: d
 * object_value( { a: { b: "c" } }, 'b.c' ); // Returns: false
 * object_value( { a: { b: "c" } }, 'b.c', {} ); // Returns: {}
 * @returns {*|Boolean} Returns value or false.
 */
export default function object_value (obj, property, default_val) {
  default_val = typeof default_val !== 'undefined'
    ? default_val
    : false;
  let tree;
  switch (typeof property) {
    case 'string':
      tree = property.split('.');
      break;
    case 'object':
      tree = (Array.isArray(property))
        ? property
        : false;
      break;
    default:
      tree = false;
      break;
  }

  if (typeof obj !== 'object'
    || obj === null // fix: check for null
    || !tree) {
    return default_val;
  }

  let tree_length = tree.length,
    node = tree_length > 0
      ? tree.shift() // remove first element
      : false;

  // console.log("tree_length:", tree_length);
  // console.log("node:", node);
  // console.log("obj[node]:", obj[node]);

  if (!node) {
    return default_val;
  }

  if (typeof obj[node] === "undefined") {
    return default_val;
  }

  if (tree_length > 1) {
    if (typeof obj[node] === 'object') {
      return object_value(obj[node], tree, default_val)
    }
  } else {
    return typeof obj[node] !== 'undefined'
      ? obj[node]
      : default_val;
  }

};