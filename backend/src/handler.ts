import type { APIGatewayProxyHandlerV2WithJWTAuthorizer } from "aws-lambda";
import { route } from "./router.js";

export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (
  event
) => {
  return route(event);
};
