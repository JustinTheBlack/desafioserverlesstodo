import { document } from "../utils/dynamodbClient";
import { v4 as uuidV4 } from "uuid";

interface ICreateTodo {
  user_id: string,
  title: string,
  deadline: string,
}

export const handle = async (event) => {
  const { id: user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;
  const newUuid = uuidV4();
  const todo = await document.put({
    TableName: "users_todos",
    Item: {
      id: newUuid,
      user_id,
      title,
      done: false,
      deadline,
    },
    ConditionExpression: "attribute_not_exists(#id)",
    ExpressionAttributeNames: {
      "#id": newUuid
    }
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Todo created!"
    }),
    headers: {
      "Content-type": "application/json",
    },
  }
}