Assignment 9 PostgreSQL Integration

https://github.com/nothing2me/APITestAssignment8

I chose PostgreSQL because of my previous experience with building an SQL database, so its usage is a tad familiar. But also because of its compatibility with my relational design: just simple IDs, names, and status fields. AI tools such as CoPilot helped me understand the task at hand and what I needed to do in order to transform the last assignment into a database-ready solution. Saving me a headache, ChatGPT also helped with troubleshooting package and dependency setup, which was caused by some previous installation issues.

## Endpoint requests and responses
### GET all
GET http://localhost:3000/api/items

### Response
[
  { "id": 1, "name": "Study for final", "completed": false }
]

### POST item
POST http://localhost:3000/api/items
Content-Type: application/json

{

  "name": "Study for midterm",
  "completed": false
}

### Response
{ "id": 1, "name": "Study for final", "completed": false }

### GET item

GET http://localhost:3000/api/items/1

### Response
{ "id": 1, "name": "Study for final", "completed": false }

### PUT item
PUT http://localhost:3000/api/items/1
Content-Type: application/json

{
  "name": "Study for midterm",
  "completed": true
}

### Response
{ "id": 1, "name": "Study for final", "completed": true }


### DELETE item

DELETE http://localhost:3000/api/items/1

### Response
No response body

### GET missing item

GET http://localhost:3000/api/items/999

### Response
{ "error": "Item not found" }
