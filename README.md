REST API Testing
Overview: This documents testing for REST API resource endpoints using curl commands in PowerShell.

RESOURCE TESTING STEPS
GET - Getting all resources
PS D:\IntProgAssignment> curl.exe http://localhost:3000/api/resources  
[{"id":1,"name":"Have chatgpt do my homework","completed":false},
{"id":2,"name":"Cram for midterm","completed":false}]

GET- A single resource by ID
PS D:\IntProgAssignment> curl.exe http://localhost:3000/api/resources/1
{"id":1,"name":"Have chatgpt do my homework","completed":false}

GET- A resource that DNE
PS D:\IntProgAssignment> curl.exe -i http://localhost:3000/api/resources/999
{"error":"Resource not found"}

POST- Add a new resource
PS D:\IntProgAssignment> curl.exe --% -i -X POST http://localhost:3000/api/resources
{"id":3,"name":"Complete API assignment","completed":false}

PUT- Update a resource
PS D:\IntProgAssignment> curl.exe --% -i -X PUT http://localhost:3000/api/resources/3 
{"id":3,"name":"API assignment finished","completed":true}

DELETE- Delete a resource and verify  it
PS D:\IntProgAssignment> curl.exe -X DELETE http://localhost:3000/api/resources/3
PS D:\IntProgAssignment> curl.exe http://localhost:3000/api/resources/3
{"error":"Resource not found"}
