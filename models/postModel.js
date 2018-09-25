const enforceModel = db => {
  db.runCommand({
    collMod: "posts",
    validationLevel: "moderate", // don't break on existing, invalid docs
    validator: {
      $jsonSchema: {
        bsonType: "object",
        additionalProperties: false,
        required: ["text", "name", "user"],
        properties: {
          _id: {},
          user: {
            bsonType: "objectId",
            description: "'user' must be a string and is required"
          },
          text: {
            bsonType: "string",
            description: "'text' must be a string and is required"
          },
          name: {
            bsonType: "string",
            description: "'name' must be a string and is required"
          },
          avatar: {
            bsonType: "string",
            description: "'avatar' must be a string and is optional"
          },
          date: {
            bsonType: "date",
            default: Date.now
          },
          likes: [
            {
              user: {
                bsonType: "objectId",
                description: "'user' must be a string and is required"
              }
            }
          ],
          comments: [
            {
              text: {
                bsonType: "string",
                description: "'text' must be a string and is required"
              },
              name: {
                bsonType: "string",
                description: "'name' must be a string and is required"
              },
              avatar: {
                bsonType: "string",
                description: "'avatar' must be a string and is optional"
              },
              date: {
                bsonType: "date",
                default: Date.now
              }
            }
          ]
        }
      }
    }
  });
}; // end enforceModel()

module.exports = enforceModel;
