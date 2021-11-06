import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient"

export const handle: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;

  const response = await document.query({
    TableName: "users_todos",
    KeyConditionExpression: "user_id = :id",
    ExpressionAttributeValues: {
      ":id": id
    }
  }).promise();

  const userTodo = response.Items;
  console.log(response);
  if(userTodo){
    return {
      statusCode: 200,
      body: JSON.stringify(userTodo)
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Usuário Inválido!"
    })
  }
}