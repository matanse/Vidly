# Vidly
learning to set up a server and to connect it to a database with node, express, mongodb, mongoose and joi.<br />
learning with: Code with Mosh


## Validation section recap: :+1:
### Mongoose: Validation
So, in this section, you learned that: -When defining a schema, you can set the type of a property to a SchemaType object.<br />
You use this object to define the validation requirements for the given property.<br />

```
// Adding validationnew
mongoose.Schema({
  name: { type: String, required: true } 
})
```

-Validation logic is executed by Mongoose prior to saving a document to the database.<br />
You can also trigger it manually by calling the validate() method.<br />
-Built-in validators:<br />
&nbsp;&nbsp;&nbsp;-Strings: minlength, maxlength, match, enum <br />
&nbsp;&nbsp;&nbsp;-Numbers: min, max <br />
&nbsp;&nbsp;&nbsp;-Dates: min, max <br />
&nbsp;&nbsp;&nbsp;-All types: required <br />
  
// Custom validation 

```
tags: [
  type: Array,validate: {
  validator: function(v) { return v && v.length > 0; },
  message: ‘A course should have at least 1 tag.’     
}]
```

-If you need to talk to a database or a remote service to perform the validation, you need to create an async validator:<br />

```
validate: {
  isAsync: true
  validator: function(v, callback) {
  // Do the validation, when the result is ready, call the callback
  callback(isValid);
  }
}
```

-Other useful SchemaType properties: <br />
&nbsp;&nbsp;&nbsp;-Strings: lowercase, uppercase, trim <br />
&nbsp;&nbsp;&nbsp;-All types: get, set (to define a custom getter/setter)  <br />
  
  ```
  price: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v)
  }
  ```
